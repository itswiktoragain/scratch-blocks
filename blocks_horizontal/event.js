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

Blockly.Blocks['event_whenbroadcastreceived'] = {
  /**
   * Horizontal Dry Eggs message receiver. Messages are numeric channels rather
   * than the normal broadcast-variable dropdown.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "id": "event_whenbroadcastreceived",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "icons/event_when-broadcast-received_blue.svg",
          "width": 40,
          "height": 40,
          "alt": "When message received"
        },
        {
          "type": "field_number",
          "name": "BROADCAST_OPTION",
          "value": 1,
          "min": 0,
          "precision": 1
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

Blockly.Blocks['event_broadcast'] = {
  /**
   * Horizontal Dry Eggs message sender. The toolbox supplies a math_number
   * shadow in BROADCAST_INPUT instead of event_broadcast_menu.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "id": "event_broadcast",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "icons/event_broadcast_blue.svg",
          "width": 40,
          "height": 40,
          "alt": "Send message"
        },
        {
          "type": "input_value",
          "name": "BROADCAST_INPUT",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "category": Blockly.Categories.event,
      "colour": Blockly.Colours.event.primary,
      "colourSecondary": Blockly.Colours.event.secondary,
      "colourTertiary": Blockly.Colours.event.tertiary,
      "colourQuaternary": Blockly.Colours.event.quaternary
    });
  }
};

Blockly.Blocks['event_broadcastandwait'] = {
  /**
   * Horizontal Dry Eggs message sender which waits for receivers to finish.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "id": "event_broadcastandwait",
      "message0": "%1 wait %2",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "icons/event_broadcast_blue.svg",
          "width": 40,
          "height": 40,
          "alt": "Send message and wait"
        },
        {
          "type": "input_value",
          "name": "BROADCAST_INPUT",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "category": Blockly.Categories.event,
      "colour": Blockly.Colours.event.primary,
      "colourSecondary": Blockly.Colours.event.secondary,
      "colourTertiary": Blockly.Colours.event.tertiary,
      "colourQuaternary": Blockly.Colours.event.quaternary
    });
  }
};
