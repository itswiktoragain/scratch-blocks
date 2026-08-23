/* eslint-env node */
'use strict';

var fs = require('fs');

var horizontalPath = 'blocks_compressed_horizontal.js';
var verticalPath = 'blocks_compressed_vertical.js';

var vertical = fs.readFileSync(verticalPath, 'utf8');

/*
 * Dry Eggs uses the horizontal Blockly renderer and connection engine, but it
 * should not use the historical horizontal Scratch block definitions. Those
 * definitions predate the modern Scratch catalogue and replace Control/Event
 * blocks with old icon-tile versions that do not render correctly with the
 * compatibility layout.
 *
 * The modern Scratch block definitions are renderer-agnostic. Use the complete
 * modern catalogue unchanged and let shim/dry-eggs-horizontal-layout.js provide
 * the sideways geometry.
 */
var merged = [
  '// Dry Eggs: modern Scratch catalogue rendered by the horizontal engine.\n',
  vertical,
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
  'procedures_call',
  'event_broadcast_menu',
  'event_broadcast',
  'event_whenbroadcastreceived',
  'control_repeat',
  'control_forever',
  'control_if',
  'control_if_else'
];

for (var i = 0; i < requiredBlocks.length; i++) {
  var blockName = requiredBlocks[i];
  if (merged.indexOf('Blockly.Blocks.' + blockName) === -1) {
    throw new Error('Horizontal catalogue is missing required block: ' + blockName);
  }
}

var legacyTokens = [
  'icons/control_repeat.svg',
  'icons/control_forever.svg',
  'icons/control_wait.svg',
  'icons/control_stop.svg'
];
for (var j = 0; j < legacyTokens.length; j++) {
  if (merged.indexOf(legacyTokens[j]) !== -1) {
    throw new Error('Horizontal catalogue still contains legacy control override: ' + legacyTokens[j]);
  }
}

console.log('Dry Eggs horizontal engine now uses the complete modern Scratch block catalogue.');
