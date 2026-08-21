/* eslint-env node */
'use strict';

var fs = require('fs');

var horizontalPath = 'blocks_compressed_horizontal.js';
var verticalPath = 'blocks_compressed_vertical.js';

var horizontal = fs.readFileSync(horizontalPath, 'utf8');
var vertical = fs.readFileSync(verticalPath, 'utf8');

/*
 * The historical horizontal block set only implements a handful of categories.
 * Dry Eggs needs the full Scratch catalogue while keeping the horizontal renderer
 * and the dedicated horizontal definitions where they exist.
 *
 * Load the complete vertical definitions first, then the horizontal definitions.
 * Both files register blocks by assigning Blockly.Blocks.<type>, so the horizontal
 * definitions naturally override matching Event/Control/etc. blocks without
 * removing Motion, Looks, Sound, Sensing, Data, Operators, Procedures, or extensions.
 */
var merged = [
  '// Dry Eggs: full Scratch catalogue with horizontal overrides.\n',
  vertical,
  '\n// Dry Eggs: historical horizontal-specific overrides.\n',
  horizontal,
  '\n'
].join('');

fs.writeFileSync(horizontalPath, merged);

var requiredBlocks = [
  'motion_movesteps',
  'looks_costume',
  'sound_sounds_menu',
  'sensing_of_object_menu',
  'operator_add',
  'data_variable',
  'procedures_call'
];

for (var i = 0; i < requiredBlocks.length; i++) {
  var blockName = requiredBlocks[i];
  if (merged.indexOf('Blockly.Blocks.' + blockName) === -1) {
    throw new Error('Horizontal catalogue is missing required block: ' + blockName);
  }
}

console.log('Dry Eggs horizontal catalogue now includes the full Scratch block set.');
