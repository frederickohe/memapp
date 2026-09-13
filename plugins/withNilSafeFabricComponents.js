const fs = require("fs");
const path = require("path");
const { withDangerousMod, withPodfile } = require("expo/config-plugins");

const MARKER = "nil-safe Fabric component registration";
const POD_MARKER = "# [withNilSafeFabricComponents]";

const UNSAFE_MAPPING =
  '      return `\\t\\t@"${componentName}": NSClassFromString(@"${className}"), // ${library}`;';

const SAFE_MAPPING =
  "      // " +
  MARKER +
  "\n" +
  '      return `\\t\\t{\\n\\t\\t\\tClass cls = NSClassFromString(@"${className}");\\n\\t\\t\\tif (cls) {\\n\\t\\t\\t\\tcomponents[@"${componentName}"] = cls;\\n\\t\\t\\t}\\n\\t\\t} // ${library}`;';

const UNSAFE_TEMPLATE = [
  "    thirdPartyComponents = @{",
  "{thirdPartyComponentsMapping}",
  "    };",
].join("\n");

const SAFE_TEMPLATE = [
  "    // " + MARKER,
  "    NSMutableDictionary<NSString *, Class<RCTComponentViewProtocol>> *components = [NSMutableDictionary new];",
  "{thirdPartyComponentsMapping}",
  "    thirdPartyComponents = [components copy];",
].join("\n");

const POST_INSTALL = `
    ${POD_MARKER}
    installer.pods_project.targets.each do |target|
      next unless target.name == 'react-native-webview'
      target.build_configurations.each do |bc|
        cpp = bc.build_settings['OTHER_CPLUSPLUSFLAGS'] || '$(inherited)'
        cpp = cpp.join(' ') if cpp.is_a?(Array)
        unless cpp.include?('RCT_NEW_ARCH_ENABLED')
          bc.build_settings['OTHER_CPLUSPLUSFLAGS'] = "#{cpp} -DRCT_NEW_ARCH_ENABLED=1"
        end
        defs = bc.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] || ['$(inherited)']
        defs = [defs] unless defs.is_a?(Array)
        unless defs.any? { |d| d.to_s.include?('RCT_NEW_ARCH_ENABLED') }
          bc.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = defs + ['RCT_NEW_ARCH_ENABLED=1']
        end
      end
    end
`;

const REACT_NATIVE_POST_INSTALL = `    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      :ccache_enabled => ccache_enabled?(podfile_properties),
    )`;

function patchFile(filePath, find, replace) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  const original = fs.readFileSync(filePath, "utf8");
  if (original.includes(MARKER)) {
    return true;
  }
  if (!original.includes(find)) {
    return false;
  }
  fs.writeFileSync(filePath, original.replace(find, replace));
  return true;
}

function patchGeneratedProvider(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  let contents = fs.readFileSync(filePath, "utf8");
  if (contents.includes(MARKER)) {
    return;
  }
  if (!contents.includes("thirdPartyComponents = @{")) {
    return;
  }
  contents = contents.replace(
    /thirdPartyComponents = @\{([\s\S]*?)\n    \};/,
    `// ${MARKER}\n    NSMutableDictionary<NSString *, Class<RCTComponentViewProtocol>> *components = [NSMutableDictionary new];\n$1\n    thirdPartyComponents = [components copy];`
  );
  contents = contents.replace(
    /@"([^"]+)": NSClassFromString\(@"([^"]+)"\),(\s*\/\/.*)?/g,
    `{\n\t\t\tClass cls = NSClassFromString(@"$2");\n\t\t\tif (cls) {\n\t\t\t\tcomponents[@"$1"] = cls;\n\t\t\t}\n\t\t}$3`
  );
  fs.writeFileSync(filePath, contents);
}

function withNilSafeFabricComponents(config) {
  config = withDangerousMod(config, [
    "ios",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const generator = path.join(
        projectRoot,
        "node_modules/react-native/scripts/codegen/generate-artifacts-executor/generateRCTThirdPartyComponents.js"
      );
      const template = path.join(
        projectRoot,
        "node_modules/react-native/scripts/codegen/templates/RCTThirdPartyComponentsProviderMM.template"
      );

      if (!patchFile(generator, UNSAFE_MAPPING, SAFE_MAPPING)) {
        throw new Error(
          "withNilSafeFabricComponents: could not patch generateRCTThirdPartyComponents.js"
        );
      }
      if (!patchFile(template, UNSAFE_TEMPLATE, SAFE_TEMPLATE)) {
        throw new Error(
          "withNilSafeFabricComponents: could not patch RCTThirdPartyComponentsProviderMM.template"
        );
      }

      patchGeneratedProvider(
        path.join(
          projectRoot,
          "ios/build/generated/ios/RCTThirdPartyComponentsProvider.mm"
        )
      );
      return config;
    },
  ]);

  return withPodfile(config, (config) => {
    if (config.modResults.contents.includes(POD_MARKER)) {
      return config;
    }
    if (!config.modResults.contents.includes(REACT_NATIVE_POST_INSTALL)) {
      throw new Error(
        "withNilSafeFabricComponents: could not find react_native_post_install in Podfile"
      );
    }
    config.modResults.contents = config.modResults.contents.replace(
      REACT_NATIVE_POST_INSTALL,
      `${REACT_NATIVE_POST_INSTALL}\n${POST_INSTALL}`
    );
    return config;
  });
}

module.exports = withNilSafeFabricComponents;
