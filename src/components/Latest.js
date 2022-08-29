import { collection, getDocs, limit, query, where } from "firebase/firestore";
import React from "react";
import { db } from "../firebase";

function Latest() {
  const [Posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      let Posts = [];
      try {
        const q = query(
          collection(db, "Videos"),
          where("Featured", "==", "false"),
          limit(3)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          Posts.push(doc.data());
        });

        setPosts(Posts);
        console.log(Posts);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    return () => {
      // unsub();
    };
  }, []);

  return (
    <div className="">
      <div className="inner">
        <div class="inner-sub">
          <div class="language-select">
            <ul>
              <li class="is-current">
                <span>English</span>
              </li>
            </ul>
          </div>

          <ul class="extra-news">
            <li>
              <a href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                  <g transform="translate(-30 -98)">
                    <circle
                      cx="10"
                      cy="10"
                      r="10"
                      transform="translate(30 98)"
                      fill="#2c65ff"
                    ></circle>
                    <path
                      d="M39.999 103v6m0 2v2"
                      fill="none"
                      stroke="#fff"
                      stroke-miterlimit="10"
                      stroke-width="2"
                    ></path>
                  </g>
                </svg>
                <span>
                  How We are responding to COVID-19
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="7.516"
                    height="12.711"
                    viewBox="0 0 7.516 12.711"
                  >
                    <path
                      d="M11.648,9.285,6.286,14.652,1.043,9.272,0,10.346l6.277,6.442.078-.081,6.356-6.361Z"
                      transform="translate(-9.272 12.708) rotate(-90)"
                      fill="#2c65ff"
                    ></path>
                  </svg>
                </span>
              </a>
            </li>
          </ul>
        </div>

        {/* heading title */}
        <section class="headline-news">
          <div>
            <h3 class="b">Latest News</h3>
            <div class="headline-news-item">
              <span>
                Biglory Entertainment Further Supports Humanitarian Relief for
                Ukraine Emergency.
              </span>
            </div>
          </div>
        </section>

        {/* posts */}

        <section class="posts">
          <div class="row">
            {Posts.map((d) => (
              <div key={d.id} class="col-md-4">
                <div class="post">
                  <iframe
                    src={d.Embeded}
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <br />
      <center>
        <a className="btn" href="/watch-videos">
          Watch More
        </a>
      </center>
      <br />
    </div>
  );
}

export default Latest;
