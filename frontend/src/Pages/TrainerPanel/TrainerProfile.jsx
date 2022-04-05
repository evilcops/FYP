import React, { useEffect, useState } from "react";
import axios from "axios";
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
import SideMenuTrainer from "../../Components/SideMenuTrainer";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import userService from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import trainerService from "../../services/TrainerService";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Link } from "react-router-dom";

const trainerProfileSchema = yup.object().shape({
  gender: yup.string().required("An option is required").nullable(),
  //   listed: yup.boolean(),
  exercise_type: yup.string().required("Exercise type can't be empty"),
  company_name: yup.string().nullable(),
  designation: yup.string().nullable(),
  time_worked: yup
    .number()
    .typeError("Time is required!")
    .positive("Time should be a positive number")
    .required("Time is required!"),
  qualification: yup
    .string()
    .min(2, "Qualification name must be of at least 2 characters")
    .max(30, "Qualification name must be of at most 30 characters")
    .required("Qualification name can't be empty"),
  trainer_desc: yup
    .string()
    .min(200, "Trainer description must be at least 200 characters!")
    .max(500, "Trainer description must be at most 500 characters!")
    .required("Trainer description can't be empty!"),
  certificate_file: yup.string(),
  trainer_photo: yup.string(),
});

const TrainerProfile = () => {
  const navigate = useNavigate();
  const [fileName, setFileName] = React.useState("");
  const [previewImage, setPreviewImage] = React.useState("");
  const [isProfile, setIsProfile] = useState(false);
  const [loggedInId, setLoggedInId] = useState("");
  const [isTrainerForm, setIsTrainerForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [trainerProfileDetails, setTrainerProfileDetails] = useState({
    // user_id: {
    //   full_name: "",
    //   email: "",
    //   password: "",
    //   user_type: "trainer",
    // },
    gender: "",
    exercise_type: "",
    listed: false,
    company_name: "",
    designation: "",
    time_worked: "",

    trainer_desc: "",
    certificate_file: "",
    trainer_photo: "",
  });

  useEffect(() => {
    // userService.getLoggedInUser();
    setLoggedInId(userService.getLoggedInUser()._id);
    if (userService.isLoggedIn() == false) {
      navigate("/login");
      // console.log("log in first");
    }
  }, []);

  const onChangeFile = (e) => {
    setFileName(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const changeOnClick = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("frontImage", fileName);

    axios
      .post("/cards/add", formData)
      .then((res) => console.log(res.data))
      .catch((err) => {
        console.log(err);
      });
  };

  const {
    register: controlTrainerProfile,
    handleSubmit: handleSubmitTrainerProfile,
    formState: { errors: errorsTrainerProfile },
  } = useForm({
    resolver: yupResolver(trainerProfileSchema),
  });

  const submitTrainerProfileForm = (data) => {
    // console.log("aaaaaaa");
    // setStep3(false);
    // setStep4(true);
    // setTrainerDetails({ ...trainerDetails, weekly_goal: data.weekly_goal });
    // console.log(trainerDetails);
    // console.log("aaaaaaa");
    console.log("before request");
    setTrainerProfileDetails({
      ...trainerProfileDetails,
      gender: data.gender,
      exercise_type: data.exercise_type,
      // listed: "",
      company_name: data.company_name,
      designation: data.designation,
      time_worked: data.time_worked,

      trainer_desc: data.trainer_desc,
      // certificate_file: "",
      // trainer_photo: "",
    });
    trainerService
      .update_trainer(trainerProfileDetails, loggedInId)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data, {
          position: toast.POSITION.TOP_LEFT,
        });
      });
    console.log(trainerProfileDetails);
    console.log("after request");
  };
  return (
    <div className="page-container-gym">
      <TopBar />
      <SideMenuTrainer />
      <h2>Trainer Profile</h2>
      {!isProfile ? (
        !isTrainerForm ? (
          <div className="gym-box mt-3 d-flex flex-column justify-content-start">
            <h4>There is no profile present. Click below to create a trainer profile:</h4>
            <Button
              className="w-25 mt-4"
              onClick={() => {
                setIsTrainerForm(true);
              }}
            >
              Create Profile
            </Button>
          </div>
        ) : (
          <div className="gym-box mt-3 d-flex flex-column align-items-left">
            <form
              onSubmit={handleSubmitTrainerProfile(submitTrainerProfileForm)}
              className="d-flex flex-column"
            >
              <div className="input-text d-flex flex-column">
                <div className="w-50 m-0">
                  <label for="fname">Select your exercise type</label>
                  <FormControl className="m-3 w-100 dropdown-trainer">
                    <InputLabel id="demo-simple-select-label">Select Exercise Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="exercise_type"
                      {...controlTrainerProfile("exercise_type")}
                    >
                      <MenuItem value="lbs">Cardio</MenuItem>
                      <MenuItem value="kgs">Gym</MenuItem>
                      <MenuItem value="kgs">Stretching</MenuItem>
                    </Select>
                  </FormControl>
                  <p>{errorsTrainerProfile.exercise_type?.message}</p>
                </div>

                <label for="lname">Enter your qualification</label>
                <input
                  type="text"
                  id=""
                  name="qualification"
                  {...controlTrainerProfile("qualification")}
                />
                <p>{errorsTrainerProfile.qualification?.message}</p>
                <label for="lname">Enter your company name ( optional )</label>
                <input
                  type="text"
                  id=""
                  name="company_name"
                  {...controlTrainerProfile("company_name")}
                />
                <p>{errorsTrainerProfile.company_name?.message}</p>
                <label for="lname">Enter your designation ( optional )</label>
                <input
                  type="text"
                  id=""
                  name="designation"
                  {...controlTrainerProfile("designation")}
                />
                <p>{errorsTrainerProfile.designation?.message}</p>
                <label for="lname">
                  Enter the time you are available at daily basis ( 0-12 hrs )
                </label>
                <input
                  type="number"
                  id=""
                  name="time_worked"
                  {...controlTrainerProfile("time_worked")}
                />
                <p>{errorsTrainerProfile.time_worked?.message}</p>
                <label for="lname">Your gender</label>
              </div>
              <div className="d-flex mt-2 gender-radio justify-content-start">
                <input
                  type="radio"
                  value="Male"
                  name="gender"
                  {...controlTrainerProfile("gender")}
                />
                <h4>Male</h4>
                <input
                  type="radio"
                  value="Female"
                  name="gender"
                  {...controlTrainerProfile("gender")}
                />
                <h4>Female</h4>
                <input
                  type="radio"
                  value="Both"
                  name="gender"
                  {...controlTrainerProfile("gender")}
                />
                <h4>Both</h4>
              </div>
              <p>{errorsTrainerProfile.gender?.message}</p>

              <label for="lname">Your details</label>

              <textarea
                className="text-field mt-2"
                name="trainer_desc"
                {...controlTrainerProfile("trainer_desc")}
              />
              <p>{errorsTrainerProfile.trainer_desc?.message}</p>

              <label for="lname">Upload profile picture</label>
              <p className="general-p">Please upload your profile picture</p>
              <div className="upload-photo-card">
                <TransformWrapper>
                  <TransformComponent>
                    <img className="preview" src={previewImage} alt="" />
                  </TransformComponent>
                </TransformWrapper>
              </div>
              <form onSubmit={changeOnClick} encType="multipart/form-data">
                <div className="upload-form">
                  {/* <label htmlFor="file">Choose Image</label> */}
                  <input
                    style={{ marginTop: "1rem" }}
                    // accept="image/*"
                    type="file"
                    filename="frontImage"
                    onChange={onChangeFile}
                  />
                  <button
                    style={{ marginTop: "1rem", marginBottom: "1rem" }}
                    className="btn btn-primary w-25"
                    type="submit"
                  >
                    submit
                  </button>
                </div>
              </form>

              <label for="lname">Upload certificate file</label>
              <p className="general-p">Please upload your profile picture</p>
              <input type="file" />
              <p className="general-p mt-5">
                Submit Profile to the Admin. Admin will review your profile and Approve it:
              </p>
              <Button
                type="submit"
                className="w-25 mt-3"
                // onClick={() => {
                //   setIsProfile(true);
                // }}
              >
                Submit
              </Button>
            </form>
          </div>
        )
      ) : (
        <div className="trainer-desc mt-3 d-flex flex-column">
          <div className="d-flex ">
            <div className="d-flex w-75 justify-content-between">
              <div className="trainer-img d-flex">
                <img src="../../../images/trainer.png" alt="" />
                <div className="d-flex mt-5 flex-column">
                  <h4>Hamza Kasim</h4>
                  <h4>Age:</h4>
                  <h4>Gender:</h4>
                  <h4>Status:</h4>
                </div>
              </div>
              <div className="trainer-btn d-flex flex-column">
                <Button className="mt-5">Edit</Button>
                <Button className="mt-5">Delete</Button>
              </div>
            </div>
          </div>
          <div className="m-4 d-flex flex-column">
            <h4>Exercise Type:</h4>
            <h4>Qaulification and Certification:</h4>
            <h4>About:</h4>
            <p>
              {" "}
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry's standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged. It was popularised in the 1960s with the release of
              Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerProfile;