var fs = require("fs");
var path = require("path");
var typescript = require("typescript");

/*
 * These are basically module names, which will serve
 * as namespaces when scanning is performed.
 * This is a workaround for a known i18next-scanner issue:
 * https://github.com/i18next/i18next-scanner/issues/142
 */
const namespaces = ["common", "ui", "utils", "cryptoTracker"];

/*
 * Given a path, this function returns the name of the module in which that file is.
 * Example: For path "C:\Users\Romin\Desktop\optimile\cryptoTracker\app\cryptoTracker\screens\favorite\FavoritesScreen.tsx"
 * the returned string will be "cryptoTracker".
 */
function getModuleNameForPath(filePath) {
    let namespace = "common";
    namespaces.forEach((ns) => {
        if (filePath.includes(`cryptoTracker${path.sep}app${path.sep}${ns}${path.sep}`)) {
            namespace = ns;
        }
    });
    return namespace;
}

/* Source:
 * https://github.com/nucleartux/i18next-scanner-typescript/blob/master/src/index.js
 */
function typescriptTransform(options) {
    options = options || {};
    if (!options.extensions) {
        options.extensions = [".tsx"];
    }

    return function transform(file, enc, done) {
        const extension = path.extname(file.path);
        let content = fs.readFileSync(file.path, enc);

        if (options.extensions.indexOf(extension) !== -1) {
            content = typescript.transpileModule(content, {
                compilerOptions: {
                    target: "es2018"
                },
                fileName: path.basename(file.path)
            }).outputText;

            const ns = getModuleNameForPath(file.path);
            const parser = this.parser;
            parser.options.defaultNs = ns;

            parser.parseTransFromString(content);
            parser.parseFuncFromString(content);
            parser.parseAttrFromString(content);
        }
        done();
    };
};
// End of function from source

module.exports = {
    options: {
        debug: true,
        func: {
            list: ["t", "i18next.t", "i18n.t"],
            extensions: [".js", ".jsx", ".ts", ".tsx"]
        },
        trans: {
            component: "Trans",
            extensions: [".js", ".jsx", "tsx", "ts"],
        },
        transform: typescriptTransform({extensions: [".ts", ".tsx"]}),
        lngs: ["en", "nl"],
        ns: namespaces,
        defaultNs: "common",
        keySeparator: false,
        resource: {
            loadPath: "app/{{ns}}/i18n/{{lng}}.json",
            savePath: "app/{{ns}}/i18n/{{lng}}.json",
        },
        contextFallback: false,
        removeUnusedKeys: true,
    },
    transform: typescriptTransform({extensions: [".ts", ".tsx"]}),
};
