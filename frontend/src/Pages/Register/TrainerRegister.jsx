import React, { useState } from "react";
import moment from "moment";

import "../../styles/pages.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import userService from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import trainerService from "../../services/TrainerService";

const trainerSchema = yup.object().shape({
  full_name: yup
    .string()
    .min(4, "Name must be of at least 4 characters")
    .max(25, "Name must be of at most 25 characters")
    .required()
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for name "),
  email: yup
    .string()
    .min(7, "Email must be of at least 7 characters")
    .max(30, "Email must of at most 30 characters")
    .required()
    .email(),
  password: yup
    .string()
    .min(8)
    .required()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  confirm_password: yup.string().oneOf([yup.ref("password"), null], "Passwords must match"),
  gender: yup.string().required("A radio option is required").nullable(),
  dob: yup
    .string()
    .required("DOB is Required")
    .test("DOB", "You must be 18 years old", (value) => {
      return moment().diff(moment(value), "years") >= 18;
    }),
});

const TrainerRegister = () => {
  const navigate = useNavigate();
  var trainerDetails = {
    user_id: {
      full_name: "",
      email: "",
      password: "",
      user_type: "trainer",
    },
    dob: "",
  };

  const {
    register: controlTrainer,
    handleSubmit: handleSubmitTrainer,
    formState: { errors: errorsTrainer },
  } = useForm({
    resolver: yupResolver(trainerSchema),
  });

  const submitTrainerForm = (data) => {
    const login_func = (customerDetails) => {
      userService
        .login(
          customerDetails.user_id.email,
          customerDetails.user_id.password,
          customerDetails.user_id.user_type
        )
        .then((token) => {
          // console.log(token);
          navigate("/trainer-dashboard");
        })
        .catch((err) => {
          console.log(err.toString());
          // setAuthError(`No ${data.role} account exists for this email!`);
        });
    };
    console.log("before request");
    trainerDetails = {
      ...trainerDetails,
      gender: data.gender,
      user_id: {
        ...trainerDetails.user_id,
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      },
      dob: data.dob,
    };
    trainerService
      .register_trainer(trainerDetails)
      .then((data) => {
        console.log(data);

        login_func(trainerDetails);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data, {
          position: toast.POSITION.TOP_LEFT,
        });
      });
    console.log(trainerDetails);
    console.log("after request");
  };

  return (
    <div className="page-container d-flex justify-content-center">
      <div className="outer-box-step1 d-flex flex-column justify-content-center align-items-center">
        <form
          onSubmit={handleSubmitTrainer(submitTrainerForm)}
          className="d-flex flex-column align-items-center justify-content-center form-step1"
        >
          <h2 className="text-center mb-3">Trainer Signup</h2>
          <div className="inner-box-step1 d-flex ">
            <div className="d-flex flex-column w-50 ">
              <div className="d-flex flex-column">
                <h3 className="p-4 pb-0">Your Name:</h3>
                <input type="text" name="full_name" {...controlTrainer("full_name")} />
                <p className="error-p">{errorsTrainer.full_name?.message}</p>
              </div>
              <div className="d-flex flex-column">
                <h3 className="p-4 pb-0">Your DOB:</h3>
                <input
                  type="date"
                  name="dob"
                  min="1930-01-01"
                  max="2004-01-01"
                  placeholder="dd-mm-yyyy"
                  {...controlTrainer("dob")}
                />
                <p>{errorsTrainer.dob?.message}</p>
              </div>
              <div className="d-flex flex-column">
                <h3 className="p-4 pb-0">Your Gender:</h3>
                <div className="d-flex justify-content-around">
                  <div className="radio w-25 d-flex ">
                    <input name="gender" type="radio" value="male" {...controlTrainer("gender")} />
                    <p className="m-2">Male</p>
                  </div>
                  <div className="radio w-25 d-flex  ">
                    <input
                      name="gender"
                      type="radio"
                      value="female"
                      {...controlTrainer("gender")}
                    />
                    <p className="m-2">Female</p>
                  </div>
                </div>
                <p>{errorsTrainer.gender?.message}</p>
              </div>
            </div>
            <div className="d-flex flex-column w-50">
              <div className="d-flex flex-column">
                <h3 className="p-4 pb-0">Email:</h3>
                <input type="email" name="email" {...controlTrainer("email")} />
                <p>{errorsTrainer.email?.message}</p>
              </div>
              <div className="d-flex flex-column">
                <h3 className="p-4 pb-0">Password:</h3>
                <input type="password" name="password" {...controlTrainer("password")} />
                <p>{errorsTrainer.password?.message}</p>
                <h3 className="p-4 pb-0">Confirm password:</h3>
                <input
                  type="password"
                  name="confirm_password"
                  {...controlTrainer("confirm_password")}
                />
                <p>{errorsTrainer.confirm_password?.message}</p>
              </div>
            </div>
          </div>

          <div className="buttons-trainer d-flex justify-content-between mt-3">
            <Link className="step1-btn" to="/register">
              <Button>back</Button>
            </Link>

            <Button type="submit">Signup</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerRegister;
