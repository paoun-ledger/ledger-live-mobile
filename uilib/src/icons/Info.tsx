// @flow
import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  size: number;
  color: string;
};

export default function Info({ size = 24, color }: Props): React.ReactElement {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} color={color}>
      <Path
        fill={color}
        d="M12 .375C5.58.375.375 5.582.375 12 .375 18.422 5.58 23.625 12 23.625S23.625 18.422 23.625 12C23.625 5.582 18.42.375 12 .375zm0 21A9.37 9.37 0 0 1 2.625 12 9.372 9.372 0 0 1 12 2.625 9.372 9.372 0 0 1 21.375 12 9.37 9.37 0 0 1 12 21.375zm0-15.844a1.969 1.969 0 1 1 0 3.938 1.969 1.969 0 0 1 0-3.938zm2.625 11.907c0 .31-.252.562-.563.562H9.939a.563.563 0 0 1-.563-.563v-1.125c0-.31.252-.562.563-.562h.562v-3h-.563a.563.563 0 0 1-.562-.563v-1.124c0-.311.252-.563.563-.563h3c.31 0 .562.252.562.563v4.687h.563c.31 0 .562.252.562.563v1.125z"
      />
    </Svg>
  );
}
