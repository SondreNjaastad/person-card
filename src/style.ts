import { css } from 'lit-element';

const style = css`
ha-icon {
  color: cadetblue;
}

.card-body {
  width: 100%;
  background-color: white;
  border-radius: 12px;
  color: black;
}

.header-image {
  width: 100%;
  height: 110px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  background-position: top;
  /* Make the background image cover the area of the <div>, and clip the excess */
  background-size: cover;
}

.person-image {
  height: 80px;
  width: 80px;
  border-radius: 50%;
  border-width: 5px;
  border-style: solid;
  margin-left: calc(50% - 40px);
  margin-top: -40px;
}

.location {
  width: 50%;
  text-align: center;
  margin-right: 40px
}

.battery {
  width: 50%;
  text-align: center;
  margin-left: 40px
}

.location-and-battery {
  margin-top: -35px;
  width: 100%;
  display: flex;
  font-weight: 400;
}

.name {
  width: 100%;
  text-align: center;
  margin-top: 24px;
  font-size: x-large;
  font-weight: 400;
}

.card-attributes {
  width: 100%;
  padding: 12px;
}

.card-attribute {
  margin: 12px;
  font-size: large;
}

.attribute-icon {
  height: 24px;
  width: 24px;
}`;

  export default style;