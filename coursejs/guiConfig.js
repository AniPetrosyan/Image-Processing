"use strict";

var GuiConfig = GuiConfig || {

};

GuiConfig.imageNames = [
  'tumo.jpg',
  'flower.jpg',
  'goldengate.jpg',
  'leaves.jpg',
  'woman.jpg',
  'man.jpg',
  'town.jpg',
  'mesa.jpg',
  'trump1.jpg',
  'trump2.jpg',
  'doge.jpg',
  'alpha.png'
];

let sampleDropdownOptions = ['point', 'bilinear', 'gaussian'];
let morphLinesDropdownOptions = ['marker.json'];

GuiConfig.onInit = function() {
  // starter image, if none loaded from url
  if (Gui.historyFilters.length === 0) {
    Gui.addHistoryEntry(Gui.filterDefs[0], [GuiConfig.imageNames[0]]);
  }
};

// NOTE(drew): filter names must correspond to names of filter functions unless funcName is supplied
GuiConfig.filterDefs = [
  // GENERAL
  {
    name: "Push Image",
    folderName: undefined,
    notFilter: true,
    pushImage: true,
    paramDefs: [
      {
        name: "image name",
        defaultVal: GuiConfig.imageNames[0],
        dropdownOptions: GuiConfig.imageNames,
      },
    ]
  },
  {
    name: "Batch Mode",
    notFilter: true,
    folderName: undefined,
    applyFunc: function() {
      // TODO put url stuff here
      window.open("batch.html?" + Gui.getUrl());
    },
    paramDefs: [
    ]
  },

  {
    name: "Animation",
    notFilter: true,
    folderName: undefined,
    applyFunc: function() {
      var enableAnimation = true;
      window.open("batch.html?" + Gui.getUrl(enableAnimation));
    },
    paramDefs: [
    ]
  },

  {
    name: "MorphLines",
    notFilter: true,
    folderName: undefined,
    applyFunc: function() {
      // TODO put url stuff here
      var cache = Main.imageCache;
      var lastTwoImages = [];
      for (var i = cache.length-1; i >= 0; i--) {
        if (cache[i].imageName) {
          lastTwoImages.push(cache[i].imageName);
        }
      }
      if (lastTwoImages.length >= 2) {
        window.open("morphLines.html?initialFile=" + lastTwoImages[1] +
                  "&finalFile=" + lastTwoImages[0] + "&marker=images/marker.json")
      }
    },
    paramDefs: [
    ]
  },
  // SETPIXEL OPERATIONS
  {
    name: "Fill",
    folderName: 'SetPixels',
    paramDefs: [
      {
        name: "color",
        defaultVal: [0, 0, 0],
        isColor: true,
      },
    ]
  },
  {
    name: "Brush",
    folderName: 'SetPixels',
    paramDefs: [
      {
        name: "radius",
        defaultVal: 10,
        sliderRange: [1, 100],
        isFloat: false,
      },
      {
        name: "color",
        defaultVal: [255, 255, 255],
        isColor: true,
      },
      {
        name: "verts",
        defaultVal: "",
        isString: true,
      },
    ]
  },
  {
    name: "Soft Brush",
    folderName: 'SetPixels',
    funcName: "softBrushFilter",
    paramDefs: [
      {
        name: "radius",
        defaultVal: 10,
        sliderRange: [1, 100],
        isFloat: false,
      },
      {
        name: "color",
        defaultVal: [255, 255, 255],
        isColor: true,
      },
      {
        name: "alpha at center",
        defaultVal: 1.0,
        sliderRange: [0, 1.0],
        isFloat: true,
      },
      {
        name: "verts",
        defaultVal: "",
        isString: true,
      },
    ]
  },

  // LUMINANCE OPERATIONS
  {
    name: "Brightness",
    folderName: "Luminance",
    canAnimate: true,
    paramDefs: [
      {
        name: "brightness",
        defaultVal: 0,
        sliderRange: [-1, 1],
        isFloat: true,
      },
    ]
  },
  {
    name: "Contrast",
    folderName: "Luminance",
    canAnimate: true,
    paramDefs: [
      {
        name: "contrast",
        defaultVal: 0,
        sliderRange: [-1, 1],
        isFloat: true,
      },
    ]
  },

  // COLOR OPERATIONS
  {
    name: "Grayscale",
    folderName: "Color",
    paramDefs: [
    ]
  },
  

  // FILTER OPERATIONS
  
  {
    name: "Sharpen",
    folderName: "Filters",
    paramDefs: [
    ]
  },
  {
    name: "Edge",
    folderName: "Filters",
    paramDefs: [
    ]
  },
 
  

  // DITHERING OPERATIONS
  {
    name: "Quantize",
    folderName: "Dithering",
    paramDefs: [
    ]
  },
  {
    name: "Random",
    folderName: "Dithering",
    paramDefs: [
    ]
  },
  {
    name: "Floyd-Steinberg",
    funcName: "floydFilter",
    folderName: "Dithering",
    paramDefs: [
    ]
  },

  // COMPOSITE OPERATIONS
  {
    name: "Get Alpha",
    funcName: "getAlphaFilter",
    folderName: "Composite",
    numImageInputs: 2,
    paramDefs: [
    ]
  },
 
  {
    name: "Morph",
    folderName: "Composite",
    numImageInputs: 2,
    canAnimate: true,
    paramDefs: [
      {
        name: "alpha",
        defaultVal: 0.5,
        sliderRange: [0, 1],
        isFloat: true,
      },
      {
        name: "sampleMode",
        defaultVal: sampleDropdownOptions[0],
        dropdownOptions: sampleDropdownOptions,
      },
      {
        name: "linesFile",
        defaultVal: morphLinesDropdownOptions[0],
        dropdownOptions: morphLinesDropdownOptions,
      },
    ]
  },

];
