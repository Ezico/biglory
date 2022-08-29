import { collection, getDocs, limit, query, where } from "firebase/firestore";
import React from "react";
import Slider from "react-slick";
import { db } from "../firebase";

function HomeCarousel() {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    autoplay: false,
    centerPadding: "60px",
    slidesToShow: 2,
    speed: 500,
    dots: true,
    arrow: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const q = query(
          collection(db, "Videos"),
          where("Featured", "==", "true"),
          limit(3)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          list.push(doc.data());
        });

        setData(list);
      } catch (err) {}
    };
    fetchData();

    // // LISTEN (REALTIME)
    // const unsub = onSnapshot(
    //   collection(db, "Videos"),
    //   where("Featured", "===", true),
    //   (snapShot) => {
    //     let list = [];
    //     snapShot.docs.forEach((doc) => {
    //       // list.push({ id: doc.id, ...doc.data() });
    //     });
    //     // setData(list);
    //     // console.log(list);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );

    return () => {
      // unsub();
    };
  }, []);

  return (
    <div className="dark-bg">
      <Slider {...settings}>
        {data.map((d) => (
          <div key={d.id}>
            <iframe
              width="560"
              height="315"
              src={d.Embeded}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HomeCarousel;
