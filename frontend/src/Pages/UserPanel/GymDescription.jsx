import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-modal";
import { FaSearch } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { ImCross } from "react-icons/im";
import { MdLocationPin } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TopBar from "../../Components/TopBar";
import SideMenu from "../../Components/SideMenu";
import { useNavigate } from "react-router-dom";
import userService from "../../services/UserService";
import { useParams } from "react-router-dom";
import gymService from "../../services/GymService";

const GymDescription = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // userService.getLoggedInUser();
    // setLoggedInId(userService.getLoggedInUser()._id);
    // console.log(localStorage.getItem("token"));
    if (userService.isLoggedIn() == false) {
      navigate("/login");
    } else {
      if (
        userService.getLoggedInUser().user_type == "trainer" ||
        userService.getLoggedInUser().user_type == "gym" ||
        userService.getLoggedInUser().user_type == "admin"
      ) {
        navigate("/login");
      }
    }
  }, []);
  const [gymDetails, setGymDetails] = useState({
    user_id: { full_name: "", email: "" },
    gym_membership_price: 0,
    gender_facilitation: "",
    gym_desc: "",
    gym_contact_no: "",
    location: {
      address: "",
      city: "",
      state: "",
    },
    gym_photos: [{ photo_url: "" }],
  });
  const gymId = useParams();
  function getGym() {
    gymService.get_one_gym(gymId.id).then((data) => {
      setGymDetails(data.crud);
      console.log(data);
    });
  }
  useEffect(getGym, []);
  return (
    <div className="page-container-user">
      <TopBar />
      <SideMenu />
      <h2>Gym Description</h2>
      <div className="d-flex">
        <div className="gym-desc d-flex flex-column ">
          <img src={gymDetails.gym_photos[0]?.photo_url} alt="" />
          <h4>{gymDetails.user_id.full_name}</h4>
          <h4>Membership Price:{gymDetails.gym_membership_price}</h4>
          <h4>Gender:{gymDetails.gender_facilitation}</h4>
          <p>{gymDetails.gym_desc}</p>
        </div>
        <div className="gym-contact d-flex flex-column ">
          <h4>Contact No.</h4>
          <p>{gymDetails.gym_contact_no}</p>
          <h4>Email</h4>
          <p>{gymDetails.user_id.email}</p>
          <h4>Location</h4>
          <p>{gymDetails.location.address + ", " + gymDetails.location.city}</p>
        </div>
      </div>
    </div>
  );
};

export default GymDescription;
