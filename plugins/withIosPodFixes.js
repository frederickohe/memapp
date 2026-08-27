const {
  withPodfile,
  withPodfileProperties,
  withXcodeProject,
} = require("expo/config-plugins");

const MARKER = "# [withIosPodFixes]";

const POST_INSTALL_FIXES = `
    ${MARKER}
    min_ios = podfile_properties['ios.deploymentTarget'] || '15.1'
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        current = config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current.nil? || current.to_f < min_ios.to_f
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = min_ios
        end
      end
      target.shell_script_build_phases.each do |phase|
        next unless phase.name&.include?('[Hermes] Replace Hermes')
        phase.always_out_of_date = '1'
      end
    end
`;

const REACT_NATIVE_POST_INSTALL = `    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      :ccache_enabled => ccache_enabled?(podfile_properties),
    )`;

function withIosPodFixes(config) {
  config = withPodfileProperties(config, (config) => {
    config.modResults["ios.deploymentTarget"] = "15.1";
    return config;
  });

  // Debug device builds write ip.txt into the .app so Metro can be reached.
  // Xcode's user script sandbox blocks that write.
  config = withXcodeProject(config, (config) => {
    const configurations = config.modResults.pbxXCBuildConfigurationSection();
    for (const key of Object.keys(configurations)) {
      const buildSettings = configurations[key]?.buildSettings;
      if (buildSettings) {
        buildSettings.ENABLE_USER_SCRIPT_SANDBOXING = "NO";
      }
    }
    return config;
  });

  return withPodfile(config, (config) => {
    if (config.modResults.contents.includes(MARKER)) {
      return config;
    }

    if (!config.modResults.contents.includes(REACT_NATIVE_POST_INSTALL)) {
      throw new Error(
        "withIosPodFixes: could not find react_native_post_install in Podfile"
      );
    }

    config.modResults.contents = config.modResults.contents.replace(
      REACT_NATIVE_POST_INSTALL,
      `${REACT_NATIVE_POST_INSTALL}\n${POST_INSTALL_FIXES}`
    );
    return config;
  });
}

module.exports = withIosPodFixes;
