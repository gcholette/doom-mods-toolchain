# Doom mods toolchain

A nodejs tool to help ease the doom modding workflow.

It does two things:
- package a directory to a .pk3 file
- execute GZdoom with different mod files.

## Example

```javascript
const DoomModsToolchain = require('doom-mods-toolchain')

const config = {
  // The path of the mod directory to compile
  modPath: 'C:\\Users\\Me\\workspace\\doom-mods\\src\\mods\\mod1\\',

  // Where to export the .pk3 file
  outputPath: 'C:\\Users\\Me\\workspace\\doom-mods\\out\\',

  // Where is GZDoom executable installed
  executablePath: 'C:\\Users\\Me\\workspace\\doom-mods\\gzdoom_win64\\gzdoom.exe',

  // Where mods that will be executed are located (can be different from output path)
  // if no value is provided, defaults to output path.
  executableModsPath: 'C:\\Users\\Me\\workspace\\doom-mods\\out\\',
}

const toolchain = DoomModsToolchain(config)

toolchain.compile('mod1').then(() => {
  toolchain.execute(['mod1.pk3', 'map1_3.wad'])
})
```
