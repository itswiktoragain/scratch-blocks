'use strict';

/**
 * Dry Eggs compatibility layout for the historical horizontal Scratch renderer.
 *
 * The original horizontal renderer was designed around icon tiles and a single
 * value shadow. Modern Scratch block definitions contain arbitrary labels,
 * reporters, booleans, dropdowns, and multiple inline inputs. This layer keeps
 * left-to-right stack connections from the horizontal renderer while providing
 * a modern inline content layout.
 *
 * @param {object} Blockly Loaded Scratch Blocks namespace.
 */
module.exports = function (Blockly) {
  if (!Blockly || !Blockly.BlockSvg || Blockly.BlockSvg.__dryEggsHorizontalLayoutV3) {
    return Blockly;
  }

  Blockly.BlockSvg.__dryEggsHorizontalLayoutV3 = true;

  var GRID = Blockly.BlockSvg.GRID_UNIT || 4;
  var GAP = 2 * GRID;
  var BLOCK_PADDING = 3 * GRID;
  var CONTENT_PADDING_Y = 2 * GRID;
  var REPORTER_MIN_HEIGHT = 9 * GRID;
  var REPORTER_MIN_WIDTH = 12 * GRID;
  var EMPTY_INPUT_WIDTH = 12 * GRID;
  var EMPTY_INPUT_HEIGHT = 8 * GRID;

  var getOutputShape = function (block) {
    if (!block.outputConnection) return null;
    if (typeof block.getOutputShape === 'function') return block.getOutputShape();
    if (typeof block.outputConnection.getOutputShape === 'function') {
      return block.outputConnection.getOutputShape();
    }
    return Blockly.OUTPUT_SHAPE_ROUND;
  };

  var getTargetSize = function (input) {
    var target = input.connection && input.connection.targetBlock();
    if (!target) {
      return {width: EMPTY_INPUT_WIDTH, height: EMPTY_INPUT_HEIGHT};
    }
    var size = target.getHeightWidth ? target.getHeightWidth(true) : null;
    var width = size && size.width ? size.width : target.width;
    var height = size && size.height ? size.height : target.height;
    return {
      width: Math.max(width || EMPTY_INPUT_WIDTH, EMPTY_INPUT_WIDTH),
      height: Math.max(height || EMPTY_INPUT_HEIGHT, EMPTY_INPUT_HEIGHT)
    };
  };

  var measureFields = function (input, items, signature) {
    var fields = input.fieldRow || [];
    for (var j = 0; j < fields.length; j++) {
      var field = fields[j];
      var size = field.getSize ? field.getSize() : {width: 0, height: 0};
      field.renderWidth = size.width || 0;
      field.renderSep = 0;
      if (!size.width && !size.height) continue;
      items.push({
        kind: 'field',
        field: field,
        width: size.width || 0,
        height: size.height || 0
      });
      var text = typeof field.getText === 'function' ? field.getText() : '';
      signature.push('f:' + (size.width || 0) + ':' + (size.height || 0) + ':' + text);
    }
  };

  Blockly.BlockSvg.prototype.renderCompute_ = function () {
    var metrics = {
      statement: null,
      imageField: null,
      iconMenu: null,
      width: 0,
      height: 0,
      bayHeight: 0,
      bayWidth: 0,
      bayNotchAtRight: true,
      fieldRadius: Blockly.BlockSvg.FIELD_DEFAULT_CORNER_RADIUS,
      startHat: false,
      endCap: false,
      outputShape: getOutputShape(this),
      contentItems: [],
      contentWidth: 0,
      contentHeight: 0,
      contentStart: BLOCK_PADDING,
      layoutSignature: []
    };

    var signature = metrics.layoutSignature;
    var inputs = this.inputList || [];
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (typeof input.isVisible === 'function' && !input.isVisible()) continue;

      measureFields(input, metrics.contentItems, signature);

      if (input.type === Blockly.NEXT_STATEMENT) {
        if (!metrics.statement) metrics.statement = input;
        var bayHeight = Blockly.BlockSvg.MIN_BLOCK_Y;
        var bayWidth = Blockly.BlockSvg.MIN_BLOCK_X;
        if (input.connection && input.connection.targetConnection) {
          var statementBlock = input.connection.targetBlock();
          if (statementBlock) {
            var statementSize = statementBlock.getHeightWidth(true);
            bayHeight = Math.max(bayHeight, statementSize.height || 0);
            bayWidth = Math.max(bayWidth, statementSize.width || 0);
            if (!statementBlock.lastConnectionInStack()) {
              metrics.bayNotchAtRight = false;
            } else {
              bayWidth -= Blockly.BlockSvg.NOTCH_WIDTH;
            }
          }
        }
        metrics.bayHeight = Math.max(metrics.bayHeight, bayHeight);
        metrics.bayWidth = Math.max(metrics.bayWidth, bayWidth);
        signature.push('s:' + bayWidth + ':' + bayHeight);
        continue;
      }

      if (input.type === Blockly.INPUT_VALUE && input.connection) {
        var inputSize = getTargetSize(input);
        metrics.contentItems.push({
          kind: 'input',
          input: input,
          width: inputSize.width,
          height: inputSize.height
        });
        signature.push('i:' + (input.name || '') + ':' + inputSize.width + ':' + inputSize.height);
      }
    }

    for (var k = 0; k < metrics.contentItems.length; k++) {
      var item = metrics.contentItems[k];
      metrics.contentWidth += item.width;
      metrics.contentHeight = Math.max(metrics.contentHeight, item.height);
      if (k) metrics.contentWidth += GAP;
    }

    metrics.startHat = !!(this.nextConnection && !this.previousConnection && !this.outputConnection);
    metrics.endCap = !!(!this.nextConnection && this.previousConnection && !this.outputConnection && !metrics.statement);

    if (this.outputConnection) {
      metrics.height = Math.max(REPORTER_MIN_HEIGHT, metrics.contentHeight + (2 * CONTENT_PADDING_Y));
      var shapePadding = BLOCK_PADDING;
      if (metrics.outputShape === Blockly.OUTPUT_SHAPE_ROUND ||
          metrics.outputShape === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
        shapePadding = (metrics.height / 2) + GAP;
      }
      metrics.contentStart = shapePadding;
      metrics.width = Math.max(REPORTER_MIN_WIDTH,
        metrics.contentWidth + (2 * shapePadding));
    } else {
      metrics.height = Math.max(Blockly.BlockSvg.MIN_BLOCK_Y,
        metrics.contentHeight + (2 * CONTENT_PADDING_Y));
      metrics.contentStart = BLOCK_PADDING +
        (this.previousConnection ? Blockly.BlockSvg.NOTCH_WIDTH : 0);
      metrics.width = Math.max(Blockly.BlockSvg.MIN_BLOCK_X,
        metrics.contentWidth + metrics.contentStart + BLOCK_PADDING);

      if (metrics.statement) {
        metrics.width += metrics.bayWidth +
          (4 * Blockly.BlockSvg.CORNER_RADIUS) + (2 * GRID);
        metrics.height = Math.max(metrics.height,
          metrics.bayHeight + Blockly.BlockSvg.STATEMENT_BLOCK_SPACE);
      }
      if (metrics.startHat || metrics.endCap) metrics.width += GRID;
    }

    signature.push('o:' + metrics.outputShape);
    signature.push('w:' + metrics.width + ':h:' + metrics.height);
    metrics.layoutSignature = signature.join('|');
    return metrics;
  };

  Blockly.BlockSvg.metricsAreEquivalent_ = function (first, second) {
    return !!first && !!second &&
      first.width === second.width &&
      first.height === second.height &&
      first.bayWidth === second.bayWidth &&
      first.bayHeight === second.bayHeight &&
      first.startHat === second.startHat &&
      first.endCap === second.endCap &&
      first.outputShape === second.outputShape &&
      first.layoutSignature === second.layoutSignature;
  };

  var reporterPath = function (width, height, shape) {
    var half = height / 2;
    if (shape === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      return [
        'M', half, 0,
        'H', width - half,
        'L', width, half,
        'L', width - half, height,
        'H', half,
        'L', 0, half,
        'Z'
      ].join(' ');
    }
    if (shape === Blockly.OUTPUT_SHAPE_ROUND) {
      return [
        'M', half, 0,
        'H', width - half,
        'A', half, half, 0, 0, 1, width - half, height,
        'H', half,
        'A', half, half, 0, 0, 1, half, 0,
        'Z'
      ].join(' ');
    }
    var radius = Math.min(Blockly.BlockSvg.CORNER_RADIUS || GRID, half);
    return [
      'M', radius, 0,
      'H', width - radius,
      'A', radius, radius, 0, 0, 1, width, radius,
      'V', height - radius,
      'A', radius, radius, 0, 0, 1, width - radius, height,
      'H', radius,
      'A', radius, radius, 0, 0, 1, 0, height - radius,
      'V', radius,
      'A', radius, radius, 0, 0, 1, radius, 0,
      'Z'
    ].join(' ');
  };

  var positionField = function (block, field, x, centerY) {
    var root = field.getSvgRoot && field.getSvgRoot();
    if (!root) return;
    var size = field.getSize ? field.getSize() : {width: 0, height: 0};
    var drawX = block.RTL ? -(x + (size.width || 0)) : x;
    var drawY = centerY - ((size.height || 0) / 2);
    var scale = '';
    if (block.RTL && field instanceof Blockly.FieldImage && field.getFlipRTL()) {
      scale = ' scale(-1 1)';
      drawX += size.width || 0;
    }
    root.setAttribute('transform', 'translate(' + drawX + ',' + drawY + ')' + scale);
    if (block.isInsertionMarker && block.isInsertionMarker()) {
      root.setAttribute('display', 'none');
    } else {
      root.removeAttribute('display');
    }
  };

  var emptyInputPath = function (width, height, shape) {
    var half = height / 2;
    if (shape === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      return 'M ' + half + ' 0 H ' + (width - half) + ' L ' + width + ' ' + half +
        ' L ' + (width - half) + ' ' + height + ' H ' + half + ' L 0 ' + half + ' Z';
    }
    if (shape === Blockly.OUTPUT_SHAPE_ROUND) {
      return 'M ' + half + ' 0 H ' + (width - half) + ' A ' + half + ' ' + half +
        ' 0 0 1 ' + (width - half) + ' ' + height + ' H ' + half + ' A ' + half +
        ' ' + half + ' 0 0 1 ' + half + ' 0 Z';
    }
    return 'M 4 0 H ' + (width - 4) + ' A 4 4 0 0 1 ' + width + ' 4 V ' +
      (height - 4) + ' A 4 4 0 0 1 ' + (width - 4) + ' ' + height +
      ' H 4 A 4 4 0 0 1 0 ' + (height - 4) + ' V 4 A 4 4 0 0 1 4 0 Z';
  };

  var positionInput = function (block, item, x, centerY, blockXY) {
    var input = item.input;
    var connection = input.connection;
    var localX = block.RTL ? -x : x;

    /*
     * INPUT_VALUE is the superior connection. Give it a stable offset in the
     * parent block, move that connection to the rendered parent position, then
     * tighten FROM THE PARENT CONNECTION. Calling tighten_ on the child's output
     * connection moves the wrong side of the relationship and was the source of
     * detached/above-parent shadow bubbles in Dry Eggs.
     */
    connection.setOffsetInBlock(localX, centerY);
    connection.moveToOffset(blockXY);

    var targetConnection = connection.targetConnection;
    if (input.outlinePath) {
      if (targetConnection) {
        input.outlinePath.setAttribute('style', 'visibility: hidden');
      } else {
        var shape = typeof connection.getOutputShape === 'function' ?
          connection.getOutputShape() : Blockly.OUTPUT_SHAPE_ROUND;
        var inputY = centerY - (item.height / 2);
        input.outlinePath.setAttribute('d', emptyInputPath(item.width, item.height, shape));
        input.outlinePath.setAttribute('transform',
          'translate(' + (block.RTL ? -(x + item.width) : x) + ',' + inputY + ')');
        input.outlinePath.setAttribute('fill', block.getColourTertiary());
        input.outlinePath.setAttribute('style', 'visibility: visible');
      }
    }

    if (targetConnection) connection.tighten_();
  };

  Blockly.BlockSvg.prototype.renderDraw_ = function (metrics) {
    var blockXY = this.getRelativeToSurfaceXY();

    if (this.outputConnection) {
      this.svgPath_.setAttribute('d', reporterPath(metrics.width, metrics.height, metrics.outputShape));
      if (this.RTL) {
        this.svgPath_.setAttribute('transform', 'scale(-1 1)');
      } else {
        this.svgPath_.removeAttribute('transform');
      }

      var outputX = 0;
      var outputY = metrics.height / 2;
      this.outputConnection.setOffsetInBlock(outputX, outputY);
      this.outputConnection.moveToOffset(blockXY);
      if (this.outputConnection.targetConnection) {
        /* The superior parent input owns the tightening operation. */
        this.outputConnection.targetConnection.tighten_();
      }
    } else {
      var steps = [];
      this.renderDrawLeft_(steps, blockXY, metrics);
      this.renderDrawBottom_(steps, blockXY, metrics);
      this.renderDrawRight_(steps, blockXY, metrics);
      this.renderDrawTop_(steps, blockXY, metrics);
      this.svgPath_.setAttribute('d', steps.join(' '));
      if (this.RTL) {
        this.svgPath_.setAttribute('transform', 'scale(-1 1)');
      } else {
        this.svgPath_.removeAttribute('transform');
      }
    }

    var cursorX = metrics.contentStart;
    var centerY = metrics.height / 2;
    for (var i = 0; i < metrics.contentItems.length; i++) {
      var item = metrics.contentItems[i];
      if (item.kind === 'field') {
        positionField(this, item.field, cursorX, centerY);
      } else if (item.kind === 'input') {
        positionInput(this, item, cursorX, centerY, blockXY);
      }
      cursorX += item.width + GAP;
    }
  };

  Blockly.BlockSvg.prototype.renderClassify_ = function (metrics) {
    var shapes = [];
    if (this.outputConnection) {
      shapes.push(this.isShadow_ ? 'argument' : 'reporter');
      if (metrics.outputShape === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
        shapes.push('boolean');
      } else if (metrics.outputShape === Blockly.OUTPUT_SHAPE_ROUND) {
        shapes.push('round');
      }
    } else {
      if (metrics.statement) shapes.push('c-block');
      if (metrics.startHat) {
        shapes.push('hat');
      } else if (!metrics.statement) {
        shapes.push('stack');
      }
      if (!this.nextConnection) shapes.push('end');
    }
    this.svgGroup_.setAttribute('data-shapes', shapes.join(' '));
    if (this.getCategory()) this.svgGroup_.setAttribute('data-category', this.getCategory());
  };

  Blockly.BlockSvg.prototype.getHeightWidth = function () {
    var height = this.height;
    var width = this.width;
    var nextBlock = this.getNextBlock();
    if (nextBlock) {
      var nextSize = nextBlock.getHeightWidth();
      width += nextSize.width;
      width -= Blockly.BlockSvg.NOTCH_WIDTH;
      height = Math.max(height, nextSize.height);
    }
    return {height: height, width: width};
  };

  return Blockly;
};
