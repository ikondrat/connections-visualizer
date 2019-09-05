import React, { useEffect, useRef, useContext } from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { theme } from './gm-theme';
import { Connection } from './types';
import Slider from '@material-ui/core/Slider';
import { ConnectionsContext } from '../store/connections/ConnectionsProvider';

const MapsContainer = styled.div`
  with: 100vw;
  height: calc(100vh - 40px);
`;

const SliderContainer = styled.div`
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.8);
  z-index: 999;
  margin: 10px;
  border-radius: 10%;
`;

// define global google space
declare var google: any;
declare var MarkerClusterer: any;

const Visualizer: React.FC = props => {
  const mapsContainer = useRef(null);
  const { state, selectByPercent } = useContext(ConnectionsContext);

  const { connections, dateRange, percentage } = state;
  const getBounds = (connections: Connection[]) => {
    const bounds = new google.maps.LatLngBounds();

    connections.forEach(({ position }: Connection) => {
      bounds.extend(new google.maps.LatLng(position));
    });

    return bounds;
  };

  const initMap = () => {
    if (typeof google != 'undefined') {
      var icon = {
        url: '/marker.svg',
        size: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10 / 2, 10 / 2)
      };

      const map = new google.maps.Map(mapsContainer.current, {
        zoom: 8,
        center: new google.maps.LatLng(47.332028, 8.538852),
        styles: theme,
        disableDefaultUI: true
      });

      if (connections) {
        const markers = connections.map(({ position }: Connection) => {
          const marker = new google.maps.Marker({
            position,
            map: map,
            draggable: false,
            icon: icon
          });

          return marker;
        });

        new MarkerClusterer(map, markers, {
          imagePath:
            'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });
        map.fitBounds(getBounds(connections));
      }
    }
  };

  useEffect(() => {
    initMap();
  });

  return (
    <div>
      {<MapsContainer ref={mapsContainer}></MapsContainer>}
      <SliderContainer>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            {dateRange && dateRange.from && dateRange.till && (
              <Slider
                defaultValue={percentage}
                aria-labelledby="discrete-slider-custom"
                valueLabelDisplay={'off'}
                onChange={(
                  e: React.ChangeEvent<{}>,
                  value: number | number[]
                ) => {
                  selectByPercent(value instanceof Array ? value[0] : value);
                }}
              />
            )}
          </Grid>
        </Grid>
      </SliderContainer>
    </div>
  );
};

export default Visualizer;
