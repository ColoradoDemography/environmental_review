
require([
        "esri/map",
        "esri/dijit/Geocoder",
        "esri/dijit/Legend",
        "esri/dijit/Popup",	
		"esri/InfoTemplate",
		
        "esri/graphic",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/geometry/screenUtils",
		"esri/arcgis/utils",
		
		"esri/layers/FeatureLayer",
		"esri/layers/WebTiledLayer",
		"esri/layers/KMLLayer",
		
        "dojo/dom",
        "dojo/dom-construct",
        "dojo/query",
        "dojo/_base/Color",

		"dijit/layout/BorderContainer",
		"dijit/layout/ContentPane",
		"dijit/Menu",
		

		  "dojo/dom",
  "dojo/on",
          "dojo/domReady!"
      ], function(
        Map, Geocoder, Legend, Popup, InfoTemplate,
        Graphic, SimpleMarkerSymbol, screenUtils, utils,
		FeatureLayer, WebTiledLayer, KMLLayer,
        dom, domConstruct, query, Color,
		BorderContainer, ContentPane, Menu, dom, on
      ) { 

var glayer = new esri.layers.GraphicsLayer();

var legend = null;
var map;

var kml;
var historicPoint;
var historicPoly;
var femaFloodplain;
var wildScenic;
var natRivers;
var wetlandsInv;
var critHabitat;
var rivBuffer;
var cwcbFlood;
var airports;
var airbuffer;

var popup;
var basemap;

var legendLayers = [];


// On load, style typical form elements
$(function() {
	$("#speed2").uniform();	
});

function init() {

        popup = new esri.dijit.Popup({
          fillSymbol: new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.25]))
        }, dojo.create("div"));
		
	$("#legendDiv").draggable({
		containment : "#mapDiv"
	});
	$("#advancedbox").draggable({
		containment : "#mapDiv"
	});
	$("#disclaimer").draggable({
		containment : "#mapDiv"
	});
	
	$('#chk1').click(function() {
		if($("#chk1").is(':checked')){
			historicPoint.setVisibility(true);	
			historicPoly.setVisibility(true);	
			}else{
			historicPoint.setVisibility(false);	
			historicPoly.setVisibility(false);	
			}	
	});

	$('#chk2').click(function() {
		if($("#chk2").is(':checked')){
			kml.setVisibility(true);
			}else{
			kml.setVisibility(false);	
			}	
	});
	
	$('#chk3').click(function() {
		if($("#chk3").is(':checked')){
			femaFloodplain.setVisibility(true);	
			}else{
			femaFloodplain.setVisibility(false);	
			}	
	});

	$('#chk4').click(function() {
		if($("#chk4").is(':checked')){
			wildScenic.setVisibility(true);	
			}else{
			wildScenic.setVisibility(false);	
			}	
	});

	$('#chk5').click(function() {
		if($("#chk5").is(':checked')){
			natRivers.setVisibility(true);	
			}else{
			natRivers.setVisibility(false);	
			}	
	});	

	$('#chk6').click(function() {
		if($("#chk6").is(':checked')){
			wetlandsInv.setVisibility(true);	
			}else{
			wetlandsInv.setVisibility(false);	
			}	
	});

	$('#chk7').click(function() {
		if($("#chk7").is(':checked')){
			critHabitat.setVisibility(true);	
			}else{
			critHabitat.setVisibility(false);	
			}	
	});
	
	$('#chk8').click(function() {
		if($("#chk8").is(':checked')){
			rivBuffer.setVisibility(true);	
			}else{
			rivBuffer.setVisibility(false);	
			}	
	});	
	
	$('#chk9').click(function() {
		if($("#chk9").is(':checked')){
			cwcbFlood.setVisibility(true);	
			}else{
			cwcbFlood.setVisibility(false);	
			}	
	});	
	
	$('#chk10').click(function() {
		if($("#chk10").is(':checked')){
			airports.setVisibility(true);	
			}else{
			airports.setVisibility(false);	
			}	
	});		
	
	$('#chk11').click(function() {
		if($("#chk11").is(':checked')){
			airbuffer.setVisibility(true);	
			}else{
			airbuffer.setVisibility(false);	
			}	
	});	
	
	
	map = new esri.Map("mapDiv", {
		center : [-105.1, 40.17],
		zoom : 10,
		infoWindow: popup
	});


 
	dojo.connect(map, "onLoad", initOperationalLayer);

	dojo.byId("title").innerHTML = "Environmental Review";
	dojo.byId("subtitle").innerHTML = "CDBG";

	addbasemap("MapBoxTerrain");
}


function commafy(nStr) {
	var x, x1, x2, rgx;

	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}


function getTextContent1(graphic) {

	return graphic.attributes.RESNAME;
}

function getTextContent2(graphic) {

	return graphic.attributes.RESNAME;
}

function getTextContent3(graphic) {

	return graphic.attributes.ZONE + " Year Flood Zone";
}

function getTextContent4(graphic) {

	return graphic.attributes.STRNAME;
}

function getTextContent5(graphic) {

	return graphic.attributes.STRNAME;
}

function getTextContent6(graphic) {

	return graphic.attributes.FIRST_WETL;
}

function getTextContent7(graphic) {

	return graphic.attributes.comname;
	
}

function getTextContent8(graphic) {

	return "100 Year Flood Limit";
	
}

function getTextContent9(graphic) {

	return graphic.attributes.AP_NAME;
	
}

function getTextContent10(graphic) {

	return graphic.attributes.AP_NAME;
	
}


function getTextTitle1(graphic) {

	return "National Historic Registry";
}

function getTextTitle2(graphic) {

	return "National Historic Registry";
}

function getTextTitle3(graphic) {

	return "FEMA Floodplain";
}

function getTextTitle4(graphic) {

	return "Wild and Scenic Rivers";
}

function getTextTitle5(graphic) {

	return "Nationwide Rivers Inventory";
}

function getTextTitle6(graphic) {

	return "National Wetlands Inventory";
}

function getTextTitle7(graphic) {

	return "Endangered Species";
}

function getTextTitle8(graphic) {

	return "CWCB Flood Zone";
}

function getTextTitle9(graphic) {

	return "Airport";
}

function getTextTitle10(graphic) {

	return "Airport Buffer Zone";
}

function initOperationalLayer(map) {

	var Geocoder = new esri.dijit.Geocoder({
		autoComplete : true,
		arcgisGeocoder : {
			placeholder : "Find a place",
			sourceCountry : 'USA'
		},
		map : map
	}, dojo.byId("search"));

	// start widget
	Geocoder.startup();

	
	Geocoder.on("select", showLocation);

function showLocation(evt) {
  map.graphics.clear();
  var point = evt.result.feature.geometry;
  var template = new InfoTemplate(point[0],point[1]);
  
  var symbol = new SimpleMarkerSymbol().setStyle(
    SimpleMarkerSymbol.STYLE_SQUARE).setColor(
    new Color([255,0,0,0.5])
  );

  
  var graphic = new Graphic(point, symbol);
  map.graphics.add(graphic);

  template.setTitle("Search Result");
  template.setContent(evt.result.name);
  glayer.add(graphic.setInfoTemplate(template));
  
  map.addLayer(glayer);

}

   glayer.on('click', function(evt){
        map.infoWindow.setContent(getInfoTemplate());
        map.infoWindow.show(evt.screenPoint,map.getInfoWindowAnchor(evt.screenPoint));
    });

	var infoTemplate1 = new esri.InfoTemplate(getTextTitle1, getTextContent1);
	var infoTemplate2 = new esri.InfoTemplate(getTextTitle2, getTextContent2);
	var infoTemplate3 = new esri.InfoTemplate(getTextTitle3, getTextContent3);
	var infoTemplate4 = new esri.InfoTemplate(getTextTitle4, getTextContent4);
	var infoTemplate5 = new esri.InfoTemplate(getTextTitle5, getTextContent5);
	var infoTemplate6 = new esri.InfoTemplate(getTextTitle6, getTextContent6);
	var infoTemplate7 = new esri.InfoTemplate(getTextTitle7, getTextContent7);
	var infoTemplate8 = new esri.InfoTemplate(getTextTitle8, getTextContent8);		
	var infoTemplate9 = new esri.InfoTemplate(getTextTitle9, getTextContent9);
	var infoTemplate10 = new esri.InfoTemplate(getTextTitle10, getTextContent10);	
	
	esri.config.defaults.map.logoLink = "https://dola.colorado.gov/";
	document.getElementsByClassName('logo-med')[0].style.backgroundImage = "url(\"images/CO_LOGO.png\")";
	document.getElementsByClassName('logo-med')[0].style.backgroundRepeat = "no-repeat";

	historicPoint = new esri.layers.FeatureLayer("https://services.arcgis.com/IamIM3RJ5xHykalK/arcgis/rest/services/Hist_Pt/FeatureServer/0", {
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
		outFields : ["*"],
		infoTemplate : infoTemplate1
	});

	historicPoly = new esri.layers.FeatureLayer("https://services.arcgis.com/IamIM3RJ5xHykalK/ArcGIS/rest/services/Hist_Poly/FeatureServer/0", {
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
		outFields : ["*"],
		infoTemplate : infoTemplate2
	});

	femaFloodplain = new esri.layers.FeatureLayer("https://services.arcgis.com/IamIM3RJ5xHykalK/ArcGIS/rest/services/FEMA_CO/FeatureServer/0", {
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
		outFields : ["*"],
		infoTemplate : infoTemplate3
	});
	
	cwcbFlood = new esri.layers.FeatureLayer("https://services.arcgis.com/IamIM3RJ5xHykalK/ArcGIS/rest/services/CWCB100Yr/FeatureServer/0", {
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
		outFields : ["*"],
		infoTemplate : infoTemplate8
	});
	
	
	airports = new esri.layers.FeatureLayer("https://services.arcgis.com/IamIM3RJ5xHykalK/arcgis/rest/services/All_Airports/FeatureServer/0", {
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
		outFields : ["*"],
		infoTemplate : infoTemplate9
	});
	
	airbuffer = new esri.layers.FeatureLayer("https://services.arcgis.com/IamIM3RJ5xHykalK/arcgis/rest/services/All_Buffer/FeatureServer/0", {
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
		outFields : ["*"],
		infoTemplate : infoTemplate10
	});
	
	
var fpJson = {
  "type": "uniqueValue",
  "field1": "ZONE",
 "uniqueValueInfos": [{
    "value": "100",
	"label": "100 Year Floodplain",
    "symbol": {
      "color": [255, 0, 0, 128],
      "outline": {
        "color": [255, 0, 0, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      },
      "type": "esriSFS",
      "style": "esriSFSSolid"
    }
  },{
    "value": "500",
	"label": "500 Year Floodplain",	
    "symbol": {
      "color": [0, 0, 255, 128],
      "outline": {
        "color": [0, 0, 255, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      },
      "type": "esriSFS",
      "style": "esriSFSSolid"
    }
  }]
};	
	
	var renderer3 = new esri.renderer.UniqueValueRenderer(fpJson);
	renderer3.label= 'FEMA 100-Year Floodplain';
	femaFloodplain.setRenderer(renderer3);	
	

	wildScenic = new esri.layers.FeatureLayer("https://services.arcgis.com/IamIM3RJ5xHykalK/arcgis/rest/services/CacheRev2/FeatureServer/0", {
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
		outFields : ["*"],
		infoTemplate : infoTemplate4
	});

	natRivers = new esri.layers.FeatureLayer("https://services.arcgis.com/IamIM3RJ5xHykalK/arcgis/rest/services/NtnwdRivInv/FeatureServer/0", {
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
		outFields : ["*"],
		infoTemplate : infoTemplate5
	});

	wetlandsInv = new esri.layers.FeatureLayer("https://services.arcgis.com/IamIM3RJ5xHykalK/arcgis/rest/services/CO_National_Wetlands/FeatureServer/0", {
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
		outFields : ["*"],
		infoTemplate : infoTemplate6
	});	

	critHabitat = new esri.layers.FeatureLayer("https://services.arcgis.com/IamIM3RJ5xHykalK/arcgis/rest/services/Critical_Habitat/FeatureServer/0", {
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND,
		outFields : ["*"],
		infoTemplate : infoTemplate7
	});		
	
	rivBuffer = new esri.layers.FeatureLayer("https://services.arcgis.com/IamIM3RJ5xHykalK/arcgis/rest/services/RiverBuffer1000ft/FeatureServer/0", {
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND
	});		
	
	
	var kmlUrl = "http://dola.colorado.gov/cms-base/sites/dola.colorado.gov.gis-cms/files/html/kml_temp/z_test2.kml";
    kml = new esri.layers.KMLLayer(kmlUrl); 
    //map.addLayer(kml);

var uvrCrit = {
  "type": "uniqueValue",
  "field1": "comname",
 "uniqueValueInfos": [{
    "value": "Mexican spotted owl",
	"label": "Mexican spotted owl",	
    "symbol": {
      "color": [127,201,127, 128],
      "outline": {
        "color": [127,201,127, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      },
      "type": "esriSFS",
      "style": "esriSFSSolid"
    }
  },{
    "value": "Southwestern willow flycatcher",
    "label": "Southwestern willow flycatcher",
    "symbol": {
      "color": [190,174,212, 128],
      "outline": {
        "color": [190,174,212, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      },
      "type": "esriSFS",
      "style": "esriSFSSolid"
    }
  },{
    "value": "Clay-Loving wild buckwheat",
    "label": "Clay-Loving wild buckwheat",
    "symbol": {
      "color": [253,192,134, 128],
      "outline": {
        "color": [253,192,134, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      },
      "type": "esriSFS",
      "style": "esriSFSSolid"
    }
  },{
    "value": "Razorback sucker",
    "label": "Razorback sucker",
    "symbol": {
      "color": [191,91,23, 128],
      "outline": {
        "color": [191,91,23, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      },
      "type": "esriSFS",
      "style": "esriSFSSolid"
    }
  },{
    "value": "Colorado pikeminnow (=squawfish)",
    "label": "Colorado pikeminnow",
    "symbol": {
      "color": [240,2,127, 128],
      "outline": {
        "color": [240,2,127, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      },
      "type": "esriSFS",
      "style": "esriSFSSolid"
    }
  },{
    "value": "Preble's meadow jumping mouse",
    "label": "Preble's meadow jumping mouse",
    "symbol": {
      "color": [56,108,176, 128],
      "outline": {
        "color": [56,108,176, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      },
      "type": "esriSFS",
      "style": "esriSFSSolid"
    }
  }]
  };
  
	var chrend = new esri.renderer.UniqueValueRenderer(uvrCrit);
	critHabitat.setRenderer(chrend);	

var uvrJson2 = {
  "type": "uniqueValue",
  "field1": "FIRST_WETL",
    "defaultSymbol": {
	"label": "Other Wetlands",
    "color": [179, 135, 83, 128],
    "outline": {
      "color": [179, 135, 83, 255],
      "width": 1,
      "type": "esriSLS",
      "style": "esriSLSSolid"
    },
    "type": "esriSFS",
    "style": "esriSFSSolid"
  },
  "uniqueValueInfos": [{
    "value": "Lake",
	"label": "Lake",
    "symbol": {
      "color": [18, 0, 124, 128],
      "outline": {
        "color": [18, 0, 124, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      },
      "type": "esriSFS",
      "style": "esriSFSSolid"
    }
  },{
    "value": "Riverine",
	"label": "Riverine",	
    "symbol": {
      "color": [0, 143, 191, 128],
      "outline": {
        "color": [0, 143, 191, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      },
      "type": "esriSFS",
      "style": "esriSFSSolid"
    }
  },{
    "value": "Freshwater Pond",
    "label": "Freshwater Pond",
    "symbol": {
      "color": [103, 139, 192, 128],
      "outline": {
        "color": [103, 139, 192, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      },
      "type": "esriSFS",
      "style": "esriSFSSolid"
    }
  },{
    "value": "Freshwater Forested/Shrub Wetland",
    "label": "Freshwater Forested/Shrub Wetland",
    "symbol": {
      "color": [0, 135, 55, 128],
      "outline": {
        "color": [103, 135, 55, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      },
      "type": "esriSFS",
      "style": "esriSFSSolid"
    }
  },{
    "value": "Freshwater Emergent Wetland",
    "label": "Freshwater Emergent Wetland",
    "symbol": {
      "color": [127, 195, 25, 128],
      "outline": {
        "color": [127, 195, 25, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      },
      "type": "esriSFS",
      "style": "esriSFSSolid"
    }
  }]
};

	var renderer6 = new esri.renderer.UniqueValueRenderer(uvrJson2);
	wetlandsInv.setRenderer(renderer6);		
	
	
	
	
	var wildScenicSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 255]), 3);
	var wildScenicRen = new esri.renderer.SimpleRenderer(wildScenicSymbol);
	wildScenicRen.label= 'Wild and Scenic River';
	wildScenic.setRenderer(wildScenicRen);	
	
	var natrivSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([203, 0, 245]), 3);
	var natrivRen = new esri.renderer.SimpleRenderer(natrivSymbol);
	natrivRen.label= 'Nationwide Rivers Inventory';
	natRivers.setRenderer(natrivRen);		
	
	var rivbufSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([200, 0, 0]), 2), new dojo.Color([255, 228, 182,0.5]));
	var rivbufren = new esri.renderer.SimpleRenderer(rivbufSymbol);
	rivbufren.label= '1,000 ft River Buffer';
	rivBuffer.setRenderer(rivbufren);		
	
	
	var hpSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 255,0.5]));
	var rendererhp = new esri.renderer.SimpleRenderer(hpSymbol);
	rendererhp.label= 'Historic Areas';
	historicPoly.setRenderer(rendererhp);	

	
	var dotsymbol =  new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 8, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 1), new dojo.Color([255,255,255]));

	var renderer4 = new esri.renderer.SimpleRenderer(dotsymbol);
	renderer4.label= 'Historic Structures';
	historicPoint.setRenderer(renderer4);	
	

	var countyLayer = new esri.layers.FeatureLayer("https://services.arcgis.com/IamIM3RJ5xHykalK/arcgis/rest/services/County_C2010v3/FeatureServer/0", {
		mode : esri.layers.FeatureLayer.MODE_ONDEMAND
	});

	var defaultSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 2), new dojo.Color([0, 0, 0, 1]));

	var renderer2 = new esri.renderer.SimpleRenderer(defaultSymbol);

	countyLayer.setRenderer(renderer2);

	var cwcbSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([51, 0, 102]), 2), new dojo.Color([51, 0, 102,0.5]));
	var cwcbren = new esri.renderer.SimpleRenderer(cwcbSymbol);
	cwcbren.label= 'CWCB 100 Year Flood Zone';
	cwcbFlood.setRenderer(cwcbren);		
	
	
	var airportsSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 0, 0,0.5]));
	var airportsRen = new esri.renderer.SimpleRenderer(airportsSymbol);
	airportsRen.label= 'Airports';
	airports.setRenderer(airportsRen);	
	
	var airbufferSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 102, 0]), 2), new dojo.Color([255, 102, 0,0.5]));
	var airbufferRen = new esri.renderer.SimpleRenderer(airbufferSymbol);
	airbufferRen.label= 'Airport Buffer Zones';
	airbuffer.setRenderer(airbufferRen);		
	
	map.addLayers([rivBuffer, historicPoint, historicPoly, kml, femaFloodplain, wildScenic, natRivers, wetlandsInv, critHabitat, cwcbFlood, airbuffer, airports]);
	
	map.infoWindow.resize(450, 250);

	historicPoint.setVisibility(false);	
	historicPoly.setVisibility(false);	
	kml.setVisibility(false);	
	femaFloodplain.setVisibility(false);
	wildScenic.setVisibility(false);
	natRivers.setVisibility(false);
	wetlandsInv.setVisibility(false);
	critHabitat.setVisibility(false);
	rivBuffer.setVisibility(false);
	cwcbFlood.setVisibility(false);
	airbuffer.setVisibility(false);
	airports.setVisibility(false);	
	

	dojo.forEach(map.graphicsLayerIds, function(id) {
		var layer = map.getLayer(id);
		legendLayers.push({
			layer : layer,
			title : "TITLE"
		});
	});

	legend = new esri.dijit.Legend({
		map : map,
		layerInfos : legendLayers
	}, "legendDiv");
	legend.startup();

	map.addLayers([countyLayer]);
	
	

}

function addbasemap(bmName) {

	if (bmName == "MapBoxTerrain") {
		basemap = new esri.layers.WebTiledLayer("https://${subDomain}.tiles.mapbox.com/v3/statecodemog.map-392qgzze/${level}/${col}/${row}.png", {
			"copyright" : "<a href='https://www.mapbox.com/about/maps/'>Â© Map Box and OpenStreetMap</a>",
			"id" : "MapBoxTerrain",
			"subDomains" : ["a", "b", "c", "d"]
		});
	}

	if (bmName == "TerrainMap") {
		basemap = new esri.layers.ArcGISTiledMapServiceLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer");
	}

	if (bmName == "MapBoxStreets") {
		basemap = new esri.layers.WebTiledLayer("https://${subDomain}.tiles.mapbox.com/v3/statecodemog.map-i4mhpeb3/${level}/${col}/${row}.png", {
			"copyright" : "<a href='https://www.mapbox.com/about/maps/'>Â© Map Box and OpenStreetMap</a>",
			"id" : "MapBoxStreets",
			"subDomains" : ["a", "b", "c", "d"]
		});
	}

	if (bmName == "StamenTerrain") {
		basemap = new esri.layers.WebTiledLayer("https://${subDomain}.tile.stamen.com/terrain/${level}/${col}/${row}.png", {
			"copyright" : "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA",
			"id" : "StamenTerrain",
			"subDomains" : ["a", "b", "c", "d"]
		});
	}

	if (bmName == "Satellite") {
		basemap = new esri.layers.ArcGISTiledMapServiceLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
	}

	map.addLayer(basemap);
}

    on(dom.byId("speed2"), "change", function() {
	
map.removeLayer(basemap);

bmName = $('#speed2').val();

	if (bmName == "MapBoxTerrain") {
		basemap = new esri.layers.WebTiledLayer("https://${subDomain}.tiles.mapbox.com/v3/statecodemog.map-392qgzze/${level}/${col}/${row}.png", {
			"copyright" : "<a href='https://www.mapbox.com/about/maps/'>Â© Map Box and OpenStreetMap</a>",
			"id" : "MapBoxTerrain",
			"subDomains" : ["a", "b", "c", "d"]
		});
	}

	if (bmName == "TerrainMap") {
		basemap = new esri.layers.ArcGISTiledMapServiceLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer");
	}

	if (bmName == "MapBoxStreets") {
		basemap = new esri.layers.WebTiledLayer("https://${subDomain}.tiles.mapbox.com/v3/statecodemog.map-i4mhpeb3/${level}/${col}/${row}.png", {
			"copyright" : "<a href='https://www.mapbox.com/about/maps/'>Â© Map Box and OpenStreetMap</a>",
			"id" : "MapBoxStreets",
			"subDomains" : ["a", "b", "c", "d"]
		});
	}


	if (bmName == "Satellite") {
		basemap = new esri.layers.ArcGISTiledMapServiceLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
	}

	map.addLayer(basemap);             
    });     

function addbasemap2(bmName) {
	
}


function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function Clickhereformap(mainid) {

	var extitle;
	
	var geogname;
	if ($('#speed2').val() == '1') {
		geogname = 'Block Group';
	}
	if ($('#speed2').val() == '2') {
		geogname = 'Census Tract';
	}
	if ($('#speed2').val() == '3') {
		geogname = 'County';
	}
	if ($('#speed2').val() == '4') {
		geogname = 'Place';
	}	

	if ($('#speed').val() == '1') {
		extitle = 'Median Household Income by ' + geogname;
	}
	if ($('#speed').val() == '2') {
		extitle = 'Median Family Income by ' + geogname;
	}
	if ($('#speed').val() == '3') {
		extitle = 'Population 65+ by ' + geogname;
	}
	if ($('#speed').val() == '4') {
		extitle = 'Population Density by ' + geogname;
	}
	if ($('#speed').val() == '5') {
		extitle = 'Rental Rate by ' + geogname;
	}
	if ($('#speed').val() == '6') {
		extitle = 'Disability Rate by ' + geogname;
	}
	if ($('#speed').val() == '7') {
		extitle = 'Mobile Housing Units by ' + geogname;
	}
	if ($('#speed').val() == '8') {
		extitle = 'Low and Moderate Income by ' + geogname;
	}
	
	//new ({ wkid: 4326});
	//old ({ wkid: 102100});
	var oldx = (map.extent.xmin + map.extent.xmax) / 2;
	var oldy = (map.extent.ymin + map.extent.ymax) / 2;

	//function convert spatial ref 102100 to spatial ref 4326
	var x = oldx;
	var y = oldy;
	var num3 = x / 6378137.0;
	var num4 = num3 * 57.295779513082323;
	var num5 = Math.floor(((num4 + 180.0) / 360.0));
	var num6 = num4 - (num5 * 360.0);
	var num7 = 1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * y) / 6378137.0)));
	var newx = num6;
	var newy = num7 * 57.295779513082323;

	var newobj = new Object();
	newobj.zoom = map.getZoom();
	newobj.filename = "http://dola.colorado.gov/gis-php/phantomHsngDept.html";
	newobj.lat = newy;
	newobj.lng = newx;
	newobj.title = encodeURIComponent(extitle);
	newobj.subtitle = encodeURIComponent(dojo.byId("subtitle").innerHTML);
	newobj.stat = $('#speed').val();
	newobj.geog = $('#speed2').val();
	newobj.outname = makeid();
	
	var ds1=0;
	var fl1=0;
	
	if($("#chk1").is(':checked')){ds1=1;}
	if($("#chk2").is(':checked')){fl1=1;}	
	
	newobj.ds=ds1;
	newobj.fl=fl1;
	
	
	//output file name  ... makeid() is function creates random 5 letter filename

	$('#printspan').html('Processing...');

	$.get("http://dola.colorado.gov/gis-php/dohsngdept.php", newobj, function() {
		$('#printspan').html('DOWNLOAD');
		$('#uniform-printbtns').attr("onClick", "opmapwin('" + newobj.outname + "')");
	});

}



function opmapwin(outname) {
	window.open("http://dola.colorado.gov/tmp/" + outname + ".png");
	$('#printspan').html("Print Map");
	$('#uniform-printbtns').attr("onClick", "javascript:Clickhereformap('uniform-printbtns')");
}

function closeadvancedbox() {
	$('#advancedbox').toggle();
}

dojo.ready(init); 

     });