/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Massachusetts Institute of Technology
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Event blocks for Scratch (Horizontal / Dry Eggs).
 */
'use strict';

goog.provide('Blockly.Blocks.event');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');

/*
 * Keep only the genuinely horizontal-specific flag tile here.
 *
 * The complete vertical event catalogue is loaded before this file by
 * scripts/merge-horizontal-blocks.js. In particular, the normal Scratch
 * broadcast blocks (event_whenbroadcastreceived, event_broadcast,
 * event_broadcastandwait, and event_broadcast_menu) are intentionally NOT
 * overridden here, so Dry Eggs uses the standard message dropdown system.
 */
Blockly.Blocks['event_whenflagclicked'] = {
  /**
   * Block for when flag clicked.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "id": "event_whenflagclicked",
      "message0": "%1",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "icons/event_whenflagclicked.svg",
          "width": 40,
          "height": 40,
          "alt": "When green flag clicked",
          "flip_rtl": true
        }
      ],
      "inputsInline": true,
      "nextStatement": null,
      "category": Blockly.Categories.event,
      "colour": Blockly.Colours.event.primary,
      "colourSecondary": Blockly.Colours.event.secondary,
      "colourTertiary": Blockly.Colours.event.tertiary,
      "colourQuaternary": Blockly.Colours.event.quaternary
    });
  }
};
