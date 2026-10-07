import { createElement, useMemo } from "react";
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "expo-constants";
import { SvgXml } from "react-native-svg";
import { ICON_PLAY } from "@/components/signupIcons";
import { getYoutubeVideoId } from "@/lib/youtube";

function isExpoGo() {
  return (
    Constants.appOwnership === "expo" ||
    Constants.executionEnvironment === "storeClient"
  );
}

function loadWebView() {
  if (Platform.OS === "web" || isExpoGo()) return null;
  try {
    const { TurboModuleRegistry } = require("react-native");
    if (!TurboModuleRegistry.get("RNCWebViewModule")) return null;
    return require("react-native-webview").WebView;
  } catch {
    return null;
  }
}

const WebView = loadWebView();

// YouTube rejects playback when a WebView pretends to be youtube.com (error 153)
// or when the iOS WebView user agent is missing Safari. The document origin has
// to be the app's own site, and it must match the player `origin` parameter.
const EMBED_ORIGIN = "https://ymemberapp.com";
const IOS_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const ANDROID_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

function buildPlayerHtml(videoId) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #1a1a1a;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }
      #player, #player iframe {
        position: absolute;
        inset: 0;
        width: 100% !important;
        height: 100% !important;
        border: 0;
        pointer-events: none;
      }
      body.native #player,
      body.native #player iframe {
        pointer-events: auto;
      }
      #poster {
        position: absolute;
        inset: 0;
        z-index: 3;
        background: #1a1a1a center / cover no-repeat;
        background-image: url("https://i.ytimg.com/vi/${videoId}/hqdefault.jpg");
      }
      #poster.hidden {
        opacity: 0;
        pointer-events: none;
      }
      #ui {
        position: absolute;
        inset: 0;
        z-index: 4;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      body.native #ui {
        display: none;
      }
      .controls {
        display: flex;
        align-items: center;
        gap: 14px;
        pointer-events: auto;
        padding: 8px 12px;
        border-radius: 28px;
        background: #191D1A;
      }
      .btn {
        width: 38px;
        height: 38px;
        border: 0;
        border-radius: 19px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }
      #toggle {
        background: #FF0000;
      }
      #restart {
        background: #FFFFFF;
      }
      .btn svg {
        display: block;
      }
      .play-icon {
        margin-left: 2px;
      }
      body.playing .controls {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
      }
    </style>
  </head>
  <body>
    <div id="player"></div>
    <div id="poster"></div>
    <div id="ui">
      <div class="controls">
        <button id="toggle" class="btn" type="button" aria-label="Play"></button>
        <button id="restart" class="btn" type="button" aria-label="Restart"></button>
      </div>
    </div>
    <script>
      var PLAY_ICON = '<svg class="play-icon" width="12" height="14" viewBox="0 0 12 14" fill="none"><polygon points="0,0 12,7 0,14" fill="#FFFFFF"/></svg>';
      var PAUSE_ICON = '<svg width="12" height="14" viewBox="0 0 12 14" fill="none"><rect width="4" height="14" rx="1" fill="#FFFFFF"/><rect x="8" width="4" height="14" rx="1" fill="#FFFFFF"/></svg>';
      var RESTART_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#191D1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>';

      var VIDEO_ID = "${videoId}";
      var player = null;
      var ready = false;
      var pending = null;
      var playing = false;
      var failed = false;
      var fallbackTimer = null;
      var toggleBtn = document.getElementById("toggle");
      var restartBtn = document.getElementById("restart");
      var poster = document.getElementById("poster");

      function pageOrigin() {
        try {
          var origin = window.location.origin;
          if (origin && origin.indexOf("http") === 0) return origin;
        } catch (e) {}
        return "${EMBED_ORIGIN}";
      }

      var ORIGIN = pageOrigin();

      toggleBtn.innerHTML = PLAY_ICON;
      restartBtn.innerHTML = RESTART_ICON;

      function setPlaying(next) {
        playing = next;
        document.body.classList.toggle("playing", next);
        toggleBtn.innerHTML = next ? PAUSE_ICON : PLAY_ICON;
        toggleBtn.setAttribute("aria-label", next ? "Pause" : "Play");
        poster.classList.toggle("hidden", next);
      }

      function useNativePlayer() {
        if (failed) return;
        failed = true;
        clearTimeout(fallbackTimer);
        document.body.classList.add("native");
        document.body.classList.remove("playing");
        poster.classList.add("hidden");
        try { if (player && player.destroy) player.destroy(); } catch (e) {}
        player = null;
        ready = false;
        var host = document.getElementById("player");
        host.innerHTML = "";
        var frame = document.createElement("iframe");
        frame.src = "https://www.youtube-nocookie.com/embed/" + VIDEO_ID
          + "?autoplay=1&playsinline=1&rel=0&modestbranding=1&controls=1&enablejsapi=1&origin="
          + encodeURIComponent(ORIGIN);
        frame.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
        frame.setAttribute("allowfullscreen", "true");
        frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        host.appendChild(frame);
      }

      function play() {
        if (failed) return;
        poster.classList.add("hidden");
        if (!ready || !player || typeof player.playVideo !== "function") {
          pending = "play";
          clearTimeout(fallbackTimer);
          fallbackTimer = setTimeout(function () {
            if (!ready) useNativePlayer();
          }, 1200);
          return;
        }
        try {
          player.playVideo();
        } catch (e) {
          useNativePlayer();
        }
      }

      function pause() {
        if (failed || !ready || !player) return;
        try { player.pauseVideo(); } catch (e) {}
      }

      function restart() {
        if (failed) return;
        if (!ready || !player || typeof player.seekTo !== "function") {
          pending = "restart";
          play();
          return;
        }
        try {
          player.seekTo(0, true);
          player.playVideo();
        } catch (e) {
          useNativePlayer();
        }
      }

      toggleBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (playing && !failed) pause();
        else play();
      });

      restartBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        restart();
      });

      poster.addEventListener("click", function () {
        play();
      });

      window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player("player", {
          width: "100%",
          height: "100%",
          videoId: VIDEO_ID,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            cc_load_policy: 0,
            playsinline: 1,
            enablejsapi: 1,
            origin: ORIGIN
          },
          events: {
            onReady: function () {
              ready = true;
              clearTimeout(fallbackTimer);
              if (pending === "restart") restart();
              else if (pending === "play") play();
              pending = null;
            },
            onStateChange: function (event) {
              if (event.data === YT.PlayerState.PLAYING) setPlaying(true);
              if (event.data === YT.PlayerState.PAUSED) setPlaying(false);
              if (event.data === YT.PlayerState.ENDED) {
                setPlaying(false);
                try { player.seekTo(0, true); player.pauseVideo(); } catch (e) {}
              }
            },
            onError: function () {
              useNativePlayer();
            }
          }
        });
      };

      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.onerror = function () { useNativePlayer(); };
      document.head.appendChild(tag);
    </script>
  </body>
</html>`;
}

function YoutubeFallback({ videoId, height, style }) {
  return (
    <TouchableOpacity
      style={[styles.card, styles.fallbackCard, { height }, style]}
      onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`)}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel="Play video on YouTube"
    >
      <Image
        source={{ uri: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.play}>
        <SvgXml xml={ICON_PLAY} width={38} height={38} />
      </View>
    </TouchableOpacity>
  );
}

export function YoutubeEmbed({ url, videoId, height = 218, style }) {
  const id = getYoutubeVideoId(videoId || url);
  const html = useMemo(() => (id ? buildPlayerHtml(id) : ""), [id]);

  if (!id) return null;

  if (Platform.OS === "web") {
    return (
      <View style={[styles.card, { height }, style]}>
        {createElement("iframe", {
          srcDoc: html,
          title: "YouTube player",
          style: {
            border: "none",
            width: "100%",
            height: "100%",
            backgroundColor: "#1a1a1a",
          },
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
          referrerPolicy: "strict-origin-when-cross-origin",
        })}
      </View>
    );
  }

  if (!WebView) {
    return <YoutubeFallback videoId={id} height={height} style={style} />;
  }

  return (
    <View style={[styles.card, { height }, style]}>
      <WebView
        source={{ html, baseUrl: EMBED_ORIGIN }}
        style={styles.webview}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo
        bounces={false}
        scrollEnabled={false}
        nestedScrollEnabled={false}
        overScrollMode="never"
        setSupportMultipleWindows={false}
        mixedContentMode="always"
        allowsBackForwardNavigationGestures={false}
        hideKeyboardAccessoryView
        automaticallyAdjustContentInsets={false}
        containerStyle={styles.webviewContainer}
        userAgent={Platform.OS === "android" ? ANDROID_USER_AGENT : IOS_USER_AGENT}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  fallbackCard: {
    justifyContent: "center",
    alignItems: "center",
  },
  webviewContainer: {
    backgroundColor: "#1a1a1a",
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  play: {
    width: 38,
    height: 38,
  },
});
