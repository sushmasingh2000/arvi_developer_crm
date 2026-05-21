import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import {
    BarChart, Bar,
    LineChart, Line,
    XAxis, YAxis,
    Tooltip, CartesianGrid,
    ResponsiveContainer
} from "recharts";
import { MenuItem, TextField } from "@mui/material";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AdminDashboard = () => {
    const [year, setYear] = useState(2026);
    const [summary, setSummary] = useState({});
    const [chart, setChart] = useState([]);

    const fetchData = async () => {
        const summaryRes = await axiosInstance.post(API_URLS.all_employee_motnhly_report, {
            month: new Date().getMonth() + 1,
            year
        });

        const chartRes = await axiosInstance.post(API_URLS.monthly_report_graph, {
            year
        });

        setSummary(summaryRes.data.data || {});
        setChart(chartRes.data.data || []);
    };

    useEffect(() => {
        fetchData();
    }, [year]);

    return (
        <div className="p-6 bg-gray-100 bg-opacity-25 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Monthly Report</h1>

                <TextField
                    select
                    className="p-2 border rounded w-56"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <MenuItem value={2024}>2024</MenuItem>
                    <MenuItem value={2025}>2025</MenuItem>
                    <MenuItem value={2026}>2026</MenuItem>
                </TextField>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white bg-opacity-25 p-4 rounded shadow">
                    Leads: {summary.total_leads || 0}
                </div>

                <div className="bg-white bg-opacity-25 p-4 rounded shadow text-green-600">
                    Success: {summary.success || 0}
                </div>

                <div className="bg-white bg-opacity-25 p-4 rounded shadow text-blue-600">
                    Revenue: ₹{summary.turnover || 0}
                </div>
            </div>

            {/* BAR CHART */}
            <div className="bg-white bg-opacity-25 p-4 rounded shadow mb-6">
                <h2 className="mb-2 font-semibold">Monthly Leads</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickFormatter={(m) => months[m - 1]} />
                        <YAxis />
                        <Tooltip />

                        <Bar dataKey="leads" fill="#3b82f6" />
                        <Bar dataKey="success" fill="#22c55e" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* LINE CHART */}
          

        </div>
    );
};

export default AdminDashboard;