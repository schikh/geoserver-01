controlMousePos = new ol.control.MousePosition({
	coordinateFormat: ol.coordinate.createStringXY(4),
});

popup = document.getElementById('popup');

$('#popup-closer').on('click', function() {
	overlayPopup.setPosition(undefined);
});
	
overlayPopup = new ol.Overlay({
	element: popup
});

// Set LAMBERT PROJECTION - EPSG 31370
proj4.defs("EPSG:31370","+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs");
proj4.defs("http://www.opengis.net/gml/srs/epsg.xml#31370","+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs");

var belgianProjection = new ol.proj.Projection({
	code: 'EPSG:31370',
	extent: [0, 0, 350000, 350000],
	units: 'm'
});

//===================================================================================================================

var sourceVector = new ol.source.Vector({
    loader: function(extent) {
      $.ajax('http://localhost:9000/geoserver/test01/ows?service=WFS', {
        type: 'GET',
        data: {
          service: 'WFS',
          version: '1.1.0',
          request: 'GetFeature',
          typename: 'test01:Districts',
          srsname: 'EPSG:31370',
          bbox: extent.join(',') + ',EPSG:31370'
        }
      }).done(function(response) {
        //sourceVector.getSource().addFeatures(new ol.format.WFS().readFeatures(response));
		var formatWFS = new ol.format.WFS({
                    // version: "1.1.0",
                    // url: "http://localhost:9000/geoserver/test01/ows?service=WFS",
                    // featurePrefix: "test01", //workspace
                    // featureType: "test01:Districts", //layer name
                    // featureNS: "http://bsr.ores.be/test01", 
                    //geometryName: "DistrictGeo",  //feature name in database
                });
		var features = formatWFS.readFeatures(response);
		console.log(features);
		// var config = {
		// 	'featureNS': 'http://bsr.ores.be/test01',
		// 	'featureType': 'Districts'
		// };
        // features = new ol.format.WFS(config).readFeatures(response, {
        //     featureProjection: 'EPSG:31370'
        // });
		sourceVector.addFeatures(features);
      });
    },
	strategy: function() {
		return [[0, 0, 300000, 250000]];
	}
  });
  
//===================================================================================================================

// var sourceVector = new ol.source.Vector({
// 	loader: function(extent) {
// 		var url = 'http://localhost:9000/geoserver/test01/ows?service=WFS&' +
//              'version=2.0.0&request=GetFeature&typename=test01:Districts&' +
//              'outputFormat=application/json&srsname=EPSG:31370&' +
//              'bbox=' + extent.join(',') + ',EPSG:31370';
// 		$.ajax({
// 			url: url
// 		}).done(function(response) {
// 				var formatWFS = new ol.format.GeoJSON();
// 				//var formatWFS = new ol.format.WFS();
// 				var features = formatWFS.readFeatures(response);
// 				console.log(features);
// 				sourceVector.addFeatures(features);
// 			});
// 	},
// 	strategy: function() {
// 		return [[14637.25, 22608.21,291015.29 ,246424.28]];
// 	}
// });

//===================================================================================================================

// var sourceVector = new ol.source.Vector({
//     format: new ol.format.GeoJSON(),
//     url: function(extent) {
//         return 'http://localhost:9000/geoserver/test01/ows?service=WFS&' +
//             'version=2.0.0&request=GetFeature&typename=test01:Districts&' +
//             'outputFormat=application/json&srsname=EPSG:31370&' +
//             'bbox=' + extent.join(',') + ',EPSG:31370'; 
//     },
//     // strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
//     //     maxZoom: 10
//     // })),
// 	 projection: belgianProjection,
// 	 strategy: function() {
// 	 	return [[14637.25, 22608.21, 291015.29, 246424.28]];
// 	 }	
// });

var ortho = 'http://geoservices.wallonie.be/arcgis/rest/services/IMAGERIE/ORTHO_2015/MapServer';
var orthoLayer = new ol.layer.Tile({
      source: new ol.source.TileArcGISRest({
      url:ortho
      })
      }); 

//===================================================================================================================

// var sourceVector = new ol.source.Vector({
// 	format: new ol.format.GeoJSON(),
// 	loader: function(extent, resolution, projection) {
// 		var url = 'http://localhost:9000/geoserver/test01/ows?service=WFS&' +
// 			'version=2.0.0&request=GetFeature&typename=test01:Districts&' +
// 			'outputFormat=text/javascript&format_options=callback:loadFeaturesFixed&srsname=EPSG:31370&' +
// 			'bbox=' + extent.join(',') + ',EPSG:31370'; 
// 		$.ajax({
// 			url: url,
// 			dataType: 'jsonp'
// 		});
// 	},
// 	strategy: function() {
// 		return [ [0, 0, 250000, 250000] ];
// 	},
// 	//projection: 'EPSG:31370'
// 	projection: belgianProjection
// });

// // Executed when data is loaded by the $.ajax method.
// var loadFeaturesFixed = function(response) {
// 	console.log(response);
// 	sourceVector.addFeatures(sourceVector.readFeatures(response));
// };

//===================================================================================================================







var layerVector = new ol.layer.Vector({
	source: sourceVector
});

//hover highlight
selectPointerMove = new ol.interaction.Select({
	condition: ol.events.condition.pointerMove
});

// layerOSM = new ol.layer.Tile({
// 	source: new ol.source.OSM()
// });

// layerOSM_BW = new ol.layer.Tile({
// 	source: new ol.source.XYZ({
// 		url : 'http://a.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png'
// 	})
// });

var map = new ol.Map({
	target: 'map',
	overlays: [overlayPopup],
	controls: [controlMousePos],
	layers: [layerVector],
	view: new ol.View({
		projection: belgianProjection,
		center: [150000, 150000],
		zoom: 2
	})
});
map.addInteraction(selectPointerMove);

//function getCenterOfExtent(extent){
//	x = extent[0] + (extent[2] - extent[0]) / 2;
//	y = extent[1] + (extent[3] - extent[1]) / 2;
//	return [x, y];
//	}

var interaction;

var select = new ol.interaction.Select({
	style: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: '#FF2828'
		})
	})
});


// var format = new ol.format.WFS({
// 	featureNS:"fiware",
// 	featureType:'fw_core',
// 	schemaLocation:"http://www.opengis.net/wfs \
//                     http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd \
//                     http://192.168.4.33:9090/geoserver/grp/wfs/DescribeFeatureType?typename=fiware:fw_core"
// 				});

// function addInteraction() {
//            draw = new ol.interaction.Draw({
//              features: featureOverlay.getFeatures(),
//              type: /** @type {ol.geom.GeometryType} */ (typeSelect.value)
//            });
//            draw.on('drawend', function(evt) {
//                 // create a unique id
//                 // it is later needed to delete features
//                 // give the feature this id
//                var feature = evt.feature;
//                feature.set('geometry', feature.getGeometry()); 
//                var node = format.writeTransaction([feature], null, null, {
//                     gmlOptions: {srsName: "EPSG:3857"},
//                     featureNS: "fiware",
//                     featureType: "fiware:fw_core"
//                 });

//                 $.ajax({
//                     type: "POST",
//                     url: "http://192.168.4.33:9090/geoserver/wfs",
//                     data: new XMLSerializer().serializeToString(node),
//                     contentType: 'text/xml',
//                     success: function(data) {
//                         var result = format.readTransactionResponse(data);
//                         feature.setId(result.insertIds[0]);
//                     },
//                     error: function(e) {
//                         var errorMsg = e? (e.status + ' ' + e.statusText) : "";
//                         bootbox.alert('Error saving this feature to GeoServer.<br><br>' + errorMsg);
//                     },
//                     context: this
//                 });
//               });
//            map.addInteraction(draw);
//          }





//wfs-t
var dirty = {};
var formatWFS = new ol.format.WFS();
var formatGML = new ol.format.GML({
	featureNS: 'http://bsr.ores.be/test01',
	featureType: 'test01:Districts',
	srsName: 'EPSG:31370'
});
var transactWFS = function(p,f) {
	console.log(f);
	f.set('DistrictName', "XXX");
	//f.set('DistrictId', 12345);
	//f.setGeometryName("DistrictGeo");
	switch(p) {
		case 'insert':
			node = formatWFS.writeTransaction([f], null, null, formatGML);
			break;
		case 'update':
			node = formatWFS.writeTransaction(null, [f], null, formatGML);
			break;
		case 'delete':
			node = formatWFS.writeTransaction(null, null, [f], formatGML);
			break;
	}
	s = new XMLSerializer();
	str = s.serializeToString(node);
	str = str.replace("<geometry ","<DistrictGeo ");
	str = str.replace("</geometry>","</DistrictGeo>");
	$.ajax('http://localhost:9000/geoserver/test01/ows',{
		type: 'POST',
		dataType: 'xml',
		processData: false,
		contentType: 'text/xml',
		data: str
	}).done();
}

$('.btn-floating').hover(
	function() {
		$(this).addClass('darken-2');
	},
	function() {
		$(this).removeClass('darken-2');
	}
);

$('.btnMenu').on('click', function(event) {
	$('.btnMenu').removeClass('orange');
	$(this).addClass('orange');
	map.removeInteraction(interaction);
	select.getFeatures().clear();
	map.removeInteraction(select);
	switch($(this).attr('id')) {
	
	case 'btnSelect':
		interaction = new ol.interaction.Select({
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({color: '#f50057', width: 2})
				})
		});
		map.addInteraction(interaction);
		interaction.getFeatures().on('add', function(e) {
			props = e.element.getProperties();
			if (props.status){$('#popup-status').html(props.status);}else{$('#popup-status').html('n/a');}
			if (props.tiendas){$('#popup-tiendas').html(props.tiendas);}else{$('#popup-tiendas').html('n/a');}
			coord = $('.ol-mouse-position').html().split(',');
			overlayPopup.setPosition(coord);
			});
		break;
		
	case 'btnEdit':
		map.addInteraction(select);
		interaction = new ol.interaction.Modify({
			features: select.getFeatures()
			});
		map.addInteraction(interaction);
		
		snap = new ol.interaction.Snap({
			source: layerVector.getSource()
			});
		map.addInteraction(snap);
		
		dirty = {};
		select.getFeatures().on('add', function(e) {
			e.element.on('change', function(e) {
				dirty[e.target.getId()] = true;
				});
			});
		select.getFeatures().on('remove', function(e) {
			f = e.element;
			if (dirty[f.getId()]){
				delete dirty[f.getId()];
				featureProperties = f.getProperties();
			    delete featureProperties.boundedBy;
			    var clone = new ol.Feature(featureProperties);
			    clone.setId(f.getId());
			    transactWFS('update',clone);
				}
			});
		break;
		
	case 'btnDrawPoint':
		interaction = new ol.interaction.Draw({
		    type: 'Point',
		    source: layerVector.getSource()
		});
		map.addInteraction(interaction);
		interaction.on('drawend', function(e) {
			transactWFS('insert',e.feature);
	    });
		break;
		
	case 'btnDrawLine':
		interaction = new ol.interaction.Draw({
		    type: 'LineString',
		    source: layerVector.getSource()
		});
		map.addInteraction(interaction);
		interaction.on('drawend', function(e) {
			transactWFS('insert',e.feature);
	    });
		break;
		
	case 'btnDrawPoly':
		interaction = new ol.interaction.Draw({
		    type: 'Polygon',
		    source: layerVector.getSource()
		});
		map.addInteraction(interaction);
		interaction.on('drawend', function(e) {
			transactWFS('insert',e.feature);
	    });
		break;
		
	case 'btnDelete':
		interaction = new ol.interaction.Select();
		map.addInteraction(interaction);
		interaction.getFeatures().on('change:length', function(e) {
			transactWFS('delete',e.target.item(0));
	        interaction.getFeatures().clear();
	        selectPointerMove.getFeatures().clear();
	    });
		break;

	default:
		break;
	}
});

$('#btnZoomIn').on('click', function() {
	var view = map.getView();
	var newResolution = view.constrainResolution(view.getResolution(), 1);
	view.setResolution(newResolution);
});

$('#btnZoomOut').on('click', function() {
	var view = map.getView();
	var newResolution = view.constrainResolution(view.getResolution(), -1);
	view.setResolution(newResolution);
});