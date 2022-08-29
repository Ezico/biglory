import React, { Component } from "react";
// import items from "./data";
import Client from "./Contentful";

Client.getEntries({
  content_type: "Post",
});

const RoomContext = React.createContext();

export default class RoomProvider extends Component {
  state = {
    galleryItems: [],
    rooms: [],
    sortedRooms: [],
    featuredRooms: [],
    loading: true,
    invertersOnly: [],
    solarPanel: [],
    solarLight: [],
    battery: [],
    //
    type: "all",
    capacity: 1,
    price: 0,
    minPrice: 0,
    maxPrice: 0,
    minSize: 0,
    maxSize: 0,
    breakfast: false,
    pets: false,
  };

  getData = async () => {
    try {
      let response = await Client.getEntries({
        content_type: "jamitechProducts",
        // order: "sys.createdAt",
        order: "fields.price",
      });
      let response2 = await Client.getEntries({
        content_type: "jamitechGallery",
        order: "sys.createdAt",
      });

      let galleryItems = response2.items;
      let rooms = this.formatData(response.items);

      let featuredRooms = rooms.filter((room) => room.featured === true);
      let invertersOnly = rooms.filter(
        (room) =>
          room.type === "solar panels" ||
          room.type === "Solar panels" ||
          room.type === "Solar panel" ||
          room.type === "solar panel"
      );

      let battery = rooms.filter(
        (room) =>
          room.type === "Battery" ||
          room.type === "battery" ||
          room.type === "Batteries" ||
          room.type === "batteries"
      );
      let solarPanel = rooms.filter(
        (room) =>
          room.type === "Inverter" ||
          room.type === "inverter" ||
          room.type === "Inverters" ||
          room.type === "inverters"
      );
      let solarLight = rooms.filter(
        (room) =>
          room.type === "Solar light" ||
          room.type === "solar light" ||
          room.type === "Solar lights" ||
          room.type === "solar lights"
      );

      let maxPrice = Math.max(...rooms.map((item) => item.price));
      let maxSize = Math.max(...rooms.map((item) => item.size));
      this.setState({
        rooms,
        galleryItems,
        featuredRooms,
        invertersOnly,
        battery,
        solarPanel,
        solarLight,
        sortedRooms: rooms,
        loading: false,
        //
        price: maxPrice,
        maxPrice,
        maxSize,
      });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.getData();
  }

  formatData(items) {
    let tempItems = items.map((item) => {
      let id = item.sys.id;
      let images = item.fields.images.map((image) => image.fields.file.url);

      let room = { ...item.fields, images, id };
      return room;
    });
    return tempItems;
  }
  getRoom = (slug) => {
    let tempRooms = [...this.state.rooms];
    const room = tempRooms.find((room) => room.slug === slug);
    return room;
  };
  handleChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    console.log(name, value);

    this.setState(
      {
        [name]: value,
      },
      this.filterRooms
    );
  };
  filterRooms = () => {
    let { rooms, type, capacity, price, minSize, maxSize, breakfast, pets } =
      this.state;

    let tempRooms = [...rooms];
    // transform values
    // get capacity
    capacity = parseInt(capacity);
    price = parseInt(price);
    // filter by type
    if (type !== "all") {
      tempRooms = tempRooms.filter((room) => room.type === type);
    }
    // filter by capacity
    if (capacity !== 1) {
      tempRooms = tempRooms.filter((room) => room.capacity >= capacity);
    }
    // filter by price
    tempRooms = tempRooms.filter((room) => room.price <= price);
    //filter by size
    tempRooms = tempRooms.filter(
      (room) => room.size >= minSize && room.size <= maxSize
    );
    //filter by breakfast
    if (breakfast) {
      tempRooms = tempRooms.filter((room) => room.breakfast === true);
    }
    //filter by pets
    if (pets) {
      tempRooms = tempRooms.filter((room) => room.pets === true);
    }
    this.setState({
      sortedRooms: tempRooms,
    });
  };
  render() {
    return (
      <RoomContext.Provider
        value={{
          ...this.state,
          getRoom: this.getRoom,
          handleChange: this.handleChange,
        }}
      >
        {this.props.children}
      </RoomContext.Provider>
    );
  }
}
const RoomConsumer = RoomContext.Consumer;

export { RoomProvider, RoomConsumer, RoomContext };

export function withRoomConsumer(Component) {
  return function ConsumerWrapper(props) {
    return (
      <RoomConsumer>
        {(value) => <Component {...props} context={value} />}
      </RoomConsumer>
    );
  };
}
