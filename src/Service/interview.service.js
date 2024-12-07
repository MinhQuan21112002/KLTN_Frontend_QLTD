import axios, { AxiosError } from "axios";
import { hostName } from "../global";
const API_URL = hostName

const getInterviewByID = async (token, id) => {
    try {
        let config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
            `${API_URL}/interview/getRoom/${id}`,
            config
        );
        if (res.data.status === "200 OK") {
            return res.data.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (error) {
        const axiosError = error;
        if (
            axiosError &&
            axiosError.response &&
            axiosError.response.status === 403
        ) {
            throw new Error("no_permistion");
        } else {
            throw error;
        }
    }
};


const getAllRooms = async (token) => {
    try {
        let config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
            `${API_URL}/interview`,
            config
        );
        if (res.data.status === "200 OK") {
            return res.data.data;
        } else {
            throw new Error(res.data.message);
        }
    } catch (error) {
        const axiosError = error;
        if (
            axiosError &&
            axiosError.response &&
            axiosError.response.status === 403
        ) {
            throw new Error("no_permistion");
        } else {
            throw error;
        }
    }
};

const getCandidatesByJob = async (token, id) => {
    try {
        let config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
            `${API_URL}/interview/candidates/${id}`,
            config
        );
        return res.data.data;
    } catch (error) {
        const axiosError = error;
        if (
            axiosError &&
            axiosError.response &&
            axiosError.response.status === 403
        ) {
            throw new Error("no_permistion");
        } else {
            throw error;
        }
    }
};
const getMyInterviewer = async (token) => {
    try {
        let config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
            `${API_URL}/interview/interviewers`,
            config
        );
        return res.data.data;
    } catch (error) {
        const axiosError = error;
        if (
            axiosError &&
            axiosError.response &&
            axiosError.response.status === 403
        ) {
            throw new Error("no_permistion");
        } else {
            throw error;
        }
    }
};
const interviewerAssign = async (token, form) => {
    try {
        let config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.post(
            `${API_URL}/interview/interviewerAssign`,
            form,
            config
        );
        return res.data;
    } catch (error) {
        const axiosError = error;
        if (
            axiosError &&
            axiosError.response &&
            axiosError.response.status === 403
        ) {
            throw new Error("no_permistion");
        } else {
            throw error;
        }
    }
};


const candidateAssign = async (token, form) => {
    try {
        let config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.post(
            `${API_URL}/interview/candidateAssign`,
            form,
            config
        );
        return res.data;
    } catch (error) {
        const axiosError = error;
        if (
            axiosError &&
            axiosError.response &&
            axiosError.response.status === 403
        ) {
            throw new Error("no_permistion");
        } else {
            throw error;
        }
    }
};


const sendCalendar = async (form, token) => {
    try {
        let config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.post(
            `${API_URL}/calendar/google-send-invitation`,
            form,
            config
        );
        return res.data;
    } catch (error) {
        const axiosError = error;
        if (
            axiosError &&
            axiosError.response &&
            axiosError.response.status === 403
        ) {
            throw new Error("no_permistion");
        } else {
            throw error;
        }
    }
};

const updateRoom = async (form, token) => {
    try {
        let config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.put(`${API_URL}/interview`, form, config);
        return res.data;
    } catch (error) {
        const axiosError = error;
        if (
            axiosError &&
            axiosError.response &&
            axiosError.response.status === 403
        ) {
            throw new Error("no_permistion");
        } else {
            throw error;
        }
    }
};

const deleteRoom = async (token,id) => {
    try {
        let config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.delete(`${API_URL}/interview/${id}`, config);
        return res.data;
    } catch (error) {
        const axiosError = error;
        if (
            axiosError &&
            axiosError.response &&
            axiosError.response.status === 403
        ) {
            throw new Error("no_permistion");
        } else {
            throw error;
        }
    }
};

export const interviewService = {
    getAllRooms,
    getCandidatesByJob,
    getMyInterviewer,
    interviewerAssign,
    getInterviewByID,
    sendCalendar,
    updateRoom,
    candidateAssign,
    deleteRoom,
};
