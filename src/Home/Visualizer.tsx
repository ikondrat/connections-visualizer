import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from './gm-theme';
import * as d3 from 'd3';
import './visualizer.css';

const MapsContainer = styled.div`
  with: 100vw;
  height: 100vh;
`;

// define global google space
declare var google: any;

const stations = {
  KMAE: [
    -120.12,
    36.98,
    'MADERA MUNICIPAL AIRPORT',
    [26, 1, 2, 5, 6, 3, 2, 1, 2, 7, 29, 12, 3]
  ],
  KSJC: [
    -121.92,
    37.37,
    'SAN JOSE INTERNATIONAL  AIRPORT',
    [28, 1, 1, 1, 6, 10, 5, 3, 2, 4, 14, 21, 7]
  ],
  KMCE: [
    -120.5,
    37.28,
    'MERCED MUNICIPAL AIRPORT',
    [29, 1, 1, 3, 7, 5, 2, 1, 3, 6, 12, 26, 5]
  ],
  KMER: [
    -120.57,
    37.37,
    'Merced / Castle Air Force Base',
    [34, 1, 1, 1, 4, 5, 2, 1, 1, 4, 17, 22, 7]
  ],
  KAPC: [
    -122.28,
    38.2,
    'NAPA COUNTY AIRPORT',
    [23, 2, 1, 6, 3, 3, 8, 18, 11, 13, 4, 3, 5]
  ],
  KSUU: [
    -121.95,
    38.27,
    'Fairfield / Travis Air Force Base',
    [13, 7, 4, 3, 3, 6, 4, 13, 33, 4, 1, 2, 7]
  ],
  KSQL: [
    -122.25,
    37.52,
    'San Carlos Airport',
    [18, 3, 2, 2, 3, 4, 3, 2, 5, 17, 16, 12, 12]
  ],
  KSNS: [
    -121.6,
    36.67,
    'SALINAS MUNICIPAL AIRPORT',
    [21, 1, 1, 6, 12, 3, 1, 2, 9, 21, 17, 5, 1]
  ],
  KMOD: [
    -120.95,
    37.62,
    'MODESTO CITY CO SHAM FLD',
    [27, 1, 1, 2, 10, 5, 1, 1, 1, 3, 17, 24, 8]
  ],
  KOAK: [
    -122.23,
    37.72,
    'METRO OAKLAND INTERNATIONAL  AIRPORT ',
    [16, 3, 3, 2, 4, 6, 3, 4, 9, 23, 20, 6, 2]
  ],
  KSCK: [
    -121.23,
    37.9,
    'STOCKTON METROPOLITAN AIRPORT ',
    [21, 2, 2, 3, 6, 8, 2, 1, 4, 15, 19, 12, 4]
  ],
  KCCR: [
    -122.05,
    38.0,
    'CONCORD BUCHANAN FIELD',
    [24, 3, 2, 1, 1, 5, 17, 12, 9, 9, 7, 6, 4]
  ],
  KMRY: [
    -121.85,
    36.58,
    'MONTEREY PENINSULA AIRPORT',
    [26, 1, 2, 9, 5, 3, 4, 9, 13, 14, 9, 4, 1]
  ],
  KPAO: [
    -122.12,
    37.47,
    'Palo Alto Airport',
    [31, 3, 1, 1, 2, 5, 1, 1, 1, 4, 10, 25, 14]
  ],
  KSAC: [
    -121.5,
    38.5,
    'SACRAMENTO EXECUTIVE AIRPORT ',
    [32, 1, 0, 1, 3, 11, 12, 16, 5, 2, 4, 9, 3]
  ],
  KHWD: [
    -122.12,
    37.67,
    'HAYWARD AIR TERMINAL',
    [20, 2, 7, 2, 2, 6, 3, 3, 6, 23, 18, 6, 2]
  ],
  KSTS: [
    -122.82,
    38.5,
    'SANTA ROSA SONOMA COUNTY',
    [46, 1, 0, 1, 5, 13, 10, 4, 3, 3, 4, 6, 3]
  ],
  KSMF: [
    -121.6,
    38.7,
    'SACRAMENTO INTERNATIONAL  AIRPORT',
    [19, 2, 1, 2, 4, 21, 18, 8, 3, 2, 5, 12, 4]
  ],
  KNUQ: [
    -122.05,
    37.43,
    'MOFFETT FIELD',
    [35, 3, 1, 1, 4, 7, 2, 1, 2, 5, 6, 17, 15]
  ],
  KRHV: [
    -121.82,
    37.33,
    'San Jose / Reid / Hillv',
    [35, 0, 0, 1, 4, 4, 2, 1, 1, 10, 28, 11, 1]
  ],
  KWVI: [
    -121.78,
    36.93,
    'WATSONVILLE MUNICIPAL AIRPORT ',
    [44, 1, 2, 3, 4, 5, 7, 9, 8, 4, 6, 5, 2]
  ],
  KMHR: [
    -121.3,
    38.55,
    'Sacramento, Sacramento Mather Airport',
    [21, 1, 1, 2, 8, 15, 12, 12, 7, 4, 5, 7, 3]
  ],
  KVCB: [
    -121.95,
    38.38,
    'VACAVILLE NUT TREE AIRPORT',
    [36, 2, 1, 1, 2, 6, 10, 18, 10, 2, 2, 5, 6]
  ],
  KSFO: [
    -122.37,
    37.62,
    'SAN FRANCISCO INTERNATIONAL  AIRPORT ',
    [13, 3, 3, 2, 3, 4, 4, 4, 7, 31, 20, 2, 3]
  ],
  KLVK: [
    -121.82,
    37.7,
    'LIVERMORE MUNICIPAL AIRPORT ',
    [32, 2, 7, 3, 1, 1, 2, 7, 9, 17, 16, 2, 1]
  ]
};

export default function Visualizer() {
  const mapsContainer = useRef(null);

  const initMap = () => {
    // Create the Google Map…
    var map = new google.maps.Map(mapsContainer.current, {
      zoom: 8,
      center: new google.maps.LatLng(37.76487, -122.41948),
      styles: theme,
      disableDefaultUI: true
    });

    google.maps.event.addListenerOnce(map, 'projection_changed', function() {
      // Load the station data. When the data comes back, create an overlay.
      var overlay = new google.maps.OverlayView();

      // Add the container when the overlay is added to the map.
      overlay.onAdd = function() {
        var layer = d3
          .select(this.getPanes().overlayLayer)
          .append('div')
          .attr('class', 'stations');

        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?
        overlay.draw = function() {
          var projection = this.getProjection(),
            padding = 10;

          var marker = layer
            .selectAll('svg')
            .data(d3.entries(stations))
            .each(transform) // update existing markers
            .enter()
            .append('svg')
            .each(transform)
            .attr('width', '10px')
            .attr('height', '10px')
            .attr('viewBox', '0 0 10 10')
            .attr('class', 'pulse');

          marker
            .append('circle')
            .attr('r', 5)
            .attr('cx', 5)
            .attr('cy', 5)
            .attr('class', 'circle-base');

          marker
            .append('circle')
            .attr('r', 5)
            .attr('cx', 5)
            .attr('cy', 5)
            .attr('class', 'circle-shadow');

          function transform(d: any) {
            d = new google.maps.LatLng(d.value[1], d.value[0]);
            d = projection.fromLatLngToDivPixel(d);
            return d3
              .select(this)
              .style('left', d.x - padding + 'px')
              .style('top', d.y - padding + 'px');
          }
        };
      };

      // Bind our overlay to the map…
      overlay.setMap(map);
    });
  };
  useEffect(() => {
    initMap();
  });
  return (
    <div>
      {/* <Container>
            <Pulse/>
        </Container> */}

      {<MapsContainer ref={mapsContainer}></MapsContainer>}
    </div>
  );
}
