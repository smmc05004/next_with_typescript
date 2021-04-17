import { NextPage } from "next";
import styled from "styled-components";
import * as d3 from "d3";
import { useEffect, useState } from "react";
import { Feature, Geometry, GeoJsonProperties } from "geojson";
import { geoPath } from "d3-geo";
import { Nation, Region } from "../../components";

const Wrapper = styled.div<{ detail: boolean }>`
  width: 100%;

  ${({ detail }) => {
    if (detail) {
      return {
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
      };
    } else {
      return {
        display: "block",
      };
    }
  }}
`;

const Trip: NextPage = () => {
  const [activeRegion, setActiveRegion] = useState<number>(0);
  const [detail, setDetail] = useState<boolean>(false);

  const initialScale = 5500; //확대시킬 값
  const initialX = -11900; //초기 위치값 X
  const initialY = 4050; //초기 위치값 Y

  const projection = d3
    .geoMercator()
    .scale(initialScale)
    .translate([initialX, initialY]);

  const onClick = (
    e: React.MouseEvent<SVGPathElement>,
    id: number,
    d: Feature<Geometry, GeoJsonProperties>
  ) => {
    setActiveRegion(id);

    const detailPath = geoPath().projection(projection)(d) as string;

    setDetail(true);

    d3.select("#detail-path")
      .attr("width", 700)
      .attr("height", 700)
      .attr("d", detailPath);
  };

  const init = () => {
    setActiveRegion(0);
    setDetail(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper id="map-wrapper" detail={detail}>
      <Nation activeRegion={activeRegion} onClick={onClick} detail={detail} />
      <Region
        setActiveRegion={setActiveRegion}
        detail={detail}
        setDetail={setDetail}
      />
    </Wrapper>
  );
};

export default Trip;
