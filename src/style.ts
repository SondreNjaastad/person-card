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
  background-image: url('https://imgproxy.natucate.com/PAd5WVIh-tjEKQM4Z6tm6W1J4Yc2JIYWrKEroD1c7mM/rs:fill/g:ce/w:3840/h:2160/aHR0cHM6Ly93d3cubmF0dWNhdGUuY29tL21lZGlhL3BhZ2VzL3JlaXNlYXJ0ZW4vNmMwODZlYmEtNzk3Yi00ZDVjLTk2YTItODhhNGM4OWUyODdlLzM3NjYwMTQ2NjMtMTU2NzQzMzYxMi8xMl9kYW5pZWxfY2FuX2JjLTIwNy5qcGc');
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