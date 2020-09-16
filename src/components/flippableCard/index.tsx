import styled from "@emotion/styled";

export const Scene = styled.div`
  padding: 12px;
  height: 200px;
  perspective: 1000px;
  width: 100%;
  min-width: 300px;
  max-width: 500px;
  margin: 0 auto;
`;

export const Card = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 1s;
  transform-style: preserve-3d;
  transform: ${(props: any) => (props.flipped ? "rotateY(180deg)" : "")};
`;

export const CardFace = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
`;

export const CardBackFace = styled(CardFace)`
  transform: rotateY(180deg);
`;
