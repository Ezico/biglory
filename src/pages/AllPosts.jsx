import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function AllPosts() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    // const fetchData = async () => {
    //   let list = [];
    //   try {
    //     const querySnapshot = await getDocs(collection(db, "users"));
    //     querySnapshot.forEach((doc) => {
    //       list.push({ id: doc.id, ...doc.data() });
    //     });
    //     setData(list);
    //     console.log(list);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // fetchData();

    // LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "Videos"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "Title",
      headerName: "Title",
      width: 200,
      editable: true,
    },
    {
      field: "Embeded",
      headerName: "Embed Link",
      width: 500,
      editable: true,
    },
    {
      field: "Featured",
      headerName: "Featured",

      width: 110,
      editable: true,
    },
    {
      field: "timeStamp",
      headerName: "Created AT",
      width: 160,
    },
  ];

  return (
    <div className="inner">
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />{" "}
      </Box>
    </div>
  );
}
