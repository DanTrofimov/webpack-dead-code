import {Compiler} from 'webpack';
import * as fs from "fs";
import path from "path";

/* TODO: 
1) add to config white & black list
2) validate on setup (fast fail)
*/

type PluginOptions = {
    outputFile: string,
    rootDir: string
}

class DeadcodePlugin {
    static defaultOptions: PluginOptions = {
        outputFile: 'unused.json',
        rootDir: 'src'
    }
    static pluginName: string = 'DeadcodePlugin'
    options: PluginOptions
    used: Set<string>
    unused: string[]

    constructor(cfg?: PluginOptions) {
        this.options = cfg ? { ...cfg } : { ...DeadcodePlugin.defaultOptions }
        this.used = new Set<string>()
        this.unused = []
    }

    apply(compiler: Compiler) {

        this.fillUsedArray(compiler)

        compiler.hooks.done.tap(DeadcodePlugin.pluginName, async () => {
            const srcPath = path.resolve(__dirname, '..', this.options.rootDir);
            await this.fillUnusedArray(srcPath);
            fs.writeFile(this.options.outputFile, JSON.stringify(this.unused), () => {});
        });
    }
    
    // collects files used at the bundle    
    fillUsedArray = (compiler: Compiler) => {
        compiler.hooks.normalModuleFactory.tap(
            DeadcodePlugin.pluginName,
            (normalModuleFactory) => {
                normalModuleFactory.hooks.module.tap('ModuleLogger', (_module, _createData, resolveData) => {
                    // @ts-ignore
                    this.used.add(_createData.resource)
                    return _module;
                });
            }
        );
    }

    // collects files from fs NOT used at the bundle
    fillUnusedArray = async (srcPath: string) => {
        const dirFiles = await fs.promises.readdir(srcPath);
        await Promise.all(dirFiles.map(async (file) => {
            const next = path.resolve(srcPath, file);
            const isDirectory = (await fs.promises.stat(next)).isDirectory();
            if (isDirectory) { 
                await this.fillUnusedArray(next)
            } else {
                this.checkSingleFile(next)
            }
        })).catch(err => console.error(err))
    }

    checkSingleFile = (filePath: string): void => {
        if (!this.used.has(filePath)) {
            this.unused.push(filePath);
        }
    }
}

export default DeadcodePlugin;