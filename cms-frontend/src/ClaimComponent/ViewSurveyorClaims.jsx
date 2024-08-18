import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const ViewSurveyorClaims = () => {
  const api_Url = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();
  const surveyor = JSON.parse(sessionStorage.getItem("active-surveyor"));

  const [applications, setApplications] = useState([]);
  const [actionStatus, setActionStatus] = useState("");
  const [amtApprovedBySurveyor, setAmtApprovedBySurveyor] = useState("");
  const [claim, setClaim] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const updateClaimStatus = (claim) => {
    setClaim(claim);
    handleShow();
  };

  const retrieveApplication = useCallback(async () => {
    const response = await axios.get(
      `${api_Url}/api/claim/fetch/surveyor-wise?surveyorId=${surveyor.id}`,
      {
        headers: {
          // Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );
    console.log(response.data);
    return response.data;
  }, [api_Url, surveyor.id]);

  useEffect(() => {
    const getApplication = async () => {
      const application = await retrieveApplication();
      if (application) {
        setApplications(application.claims);
      }
    };

    getApplication();
  }, [retrieveApplication]);

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  const updateClaim = (e) => {
    e.preventDefault();

    if (actionStatus === "") {
      alert("Please select the Claim Status");
    } else if (actionStatus === "Accepted" && amtApprovedBySurveyor === "") {
      alert("Please select the Claim Approved amount!!!");
    } else {
      fetch(`${api_Url}/api/claim/surveyor/update`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actionStatus: actionStatus,
          claimId: claim.id,
          amtApprovedBySurveyor: amtApprovedBySurveyor,
        }),
      })
        .then((result) => {
          console.log("result", result);
          result.json().then((res) => {
            if (res.success) {
              toast.success(res.responseMessage, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });

              setTimeout(() => {
                navigate("/home");
              }, 2000); // Redirect after 2 seconds
            } else {
              toast.error(res.responseMessage, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error("It seems server is down", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 custom-bg"
        style={{
          height: "45rem",
        }}
      >
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{
            borderRadius: "1em",
            height: "50px",
          }}
        >
          <h2>Assigned Claims For Survey</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <div className="table-responsive">
            <table className="table text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Policy Name</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Claim Date</th>
                  <th scope="col">Claim Amount</th>
                  <th scope="col">Accident Date</th>
                  <th scope="col">Amount Approved</th>
                  <th scope="col">Claim Status</th>
                  <th scope="col">Action Status</th>
                  <th scope="col">Customer Response</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.claim.id}>
                    <td>
                      <b>{application.policy.name}</b>
                    </td>
                    <td>
                      <b>
                        {application.customer.firstName +
                          " " +
                          application.customer.lastName}
                      </b>
                    </td>
                    <td>
                      <b>
                        {formatDateFromEpoch(
                          application.claim.claimApplicationDate
                        )}
                      </b>
                    </td>
                    <td>
                      <b>{application.claim.claimAmount}</b>
                    </td>
                    <td>
                      <b>{application.claim.dateOfAccident}</b>
                    </td>
                    <td>
                      <b>
                        {!application.claim.amtApprovedBySurveyor
                          ? "NA"
                          : application.claim.amtApprovedBySurveyor}
                      </b>
                    </td>
                    <td>
                      <b>{application.claim.claimStatus}</b>
                    </td>
                    <td>
                      <b>{application.claim.actionStatus}</b>
                    </td>
                    <td>
                      <b>{application.claim.customerClaimResponse}</b>
                    </td>
                    <td>
                      {application.claim.actionStatus ===
                      "Assigned to Surveyor" ? (
                        <button
                          onClick={() => updateClaimStatus(application.claim)}
                          className="btn btn-sm bg-color custom-bg-text"
                        >
                          <b>Update Status</b>
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title
            style={{
              borderRadius: "1em",
            }}
          >
            Update Customer Claim Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ms-3 mt-3 mb-3 me-3">
            <form>
              <div className="mb-3">
                <label htmlFor="emailId" className="form-label">
                  <b>Claim Application Date</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formatDateFromEpoch(claim.claimApplicationDate)}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="emailId" className="form-label">
                  <b>Accident Date</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={claim.dateOfAccident}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="emailId" className="form-label">
                  <b>Customer Claim Amount</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={claim.claimAmount}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <b>Claim Status</b>
                </label>

                <select
                  onChange={(e) => setActionStatus(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Status</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {actionStatus === "Accepted" && (
                <div className="mb-3">
                  <label htmlFor="emailId" className="form-label">
                    <b>Approved Amount</b>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    onChange={(e) => setAmtApprovedBySurveyor(e.target.value)}
                    value={amtApprovedBySurveyor}
                  />
                </div>
              )}

              <div className="d-flex aligns-items-center justify-content-center mb-2">
                <button
                  type="submit"
                  onClick={updateClaim}
                  className="btn bg-color custom-bg-text"
                >
                  Update Claim Status
                </button>
                <ToastContainer />
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewSurveyorClaims;
