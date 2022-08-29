import { collection, getDocs, query } from "firebase/firestore";
import React from "react";
import { db } from "../firebase";

function Videos() {
  const [Posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      let Posts = [];
      try {
        const q = query(collection(db, "Videos"));

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
    <div className="inner">
      <br />
      <section class="posts">
        <div class="row">
          {Posts.map((d) => (
            <div key={d.id} class="col-md-6">
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
      <br />
    </div>
  );
}

export default Videos;
