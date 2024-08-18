import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer from react-toastify
import { Button, Modal } from "react-bootstrap";

const ViewAllPolicyApplication = () => {
  const api_Url = process.env.REACT_APP_API_URL;
  let navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [application, setApplication] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  const updateApplicationStatus = (
    applicationId,
    status,
    startDate,
    endDate
  ) => {
    fetch(`${api_Url}/api/policy/application/status/update`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        policyApplicationId: applicationId,
        status: status,
        startDate: startDate,
        endDate: endDate,
      }),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            setTimeout(() => {
              navigate("/home");
            }, 2000);
          } else {
            toast.error(res.responseMessage, {
              position: "top-center",
              autoClose: 2000,
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
        toast.error("It seems the server is down", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  useEffect(() => {
    const retrieveApplication = async () => {
      try {
        const response = await axios.get(
          `${api_Url}/api/policy/application/fetch/all`
        );
        setApplications(response.data.applications);
      } catch (error) {
        console.error("Error retrieving applications:", error);
        // Handle error (e.g., show error message)
      }
    };

    retrieveApplication();
  }, [api_Url]);

  const showApproveModal = (application) => {
    setApplication(application);
    handleShow();
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
          <h2>All Applications</h2>
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
                  <th scope="col">Policy Id</th>
                  <th scope="col">Application Date</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td><b>{application.policy.name}</b></td>
                    <td><b>{application.policy.policyId}</b></td>
                    <td><b>{formatDateFromEpoch(application.applicationDate)}</b></td>
                    <td><b>{application.startDate ? application.startDate : "Approval Pending"}</b></td>
                    <td><b>{application.endDate ? application.endDate : "Approval Pending"}</b></td>
                    <td><b>{application.status}</b></td>
                    <td>
                      {application.status === "Pending" && (
                        <div>
                          <button
                            onClick={() => showApproveModal(application)}
                            className="btn btn-sm bg-success text-dark"
                          >
                            <b>Approve</b>
                          </button>
                          <button
                            onClick={() =>
                              updateApplicationStatus(
                                application.id,
                                "Rejected",
                                null,
                                null
                              )
                            }
                            className="btn btn-sm bg-danger text-white"
                          >
                            <b>Reject</b>
                          </button>
                        </div>
                      )}
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
          <Modal.Title style={{ borderRadius: "1em" }}>
            Approve Customer Policy Application
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ms-3 mt-3 mb-3 me-3">
            <form>
              <div className="mb-3">
                <label className="form-label"><b>Policy Name</b></label>
                <input
                  type="text"
                  className="form-control"
                  value={application?.policy?.name || ""}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><b>Policy Id</b></label>
                <input
                  type="text"
                  className="form-control"
                  value={application?.policy?.policyId || ""}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><b>Policy Start Date</b></label>
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><b>Policy End Date</b></label>
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                  required
                />
              </div>
              <div className="d-flex aligns-items-center justify-content-center mb-2">
                <button
                  type="submit"
                  onClick={() =>
                    updateApplicationStatus(
                      application.id,
                      "Approved",
                      startDate,
                      endDate
                    )
                  }
                  className="btn text-dark bg-success"
                >
                  Approve
                </button>
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
      <ToastContainer /> {/* Render ToastContainer here */}
    </div>
  );
};

export default ViewAllPolicyApplication;
