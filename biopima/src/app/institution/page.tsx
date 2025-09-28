"use client";

import ConsultantLayout from "../shared-components/Sidebar/ConsultantLayout"; 
import { useState, useEffect } from "react";
import useFetchMcu from "../hooks/useFetchMcu";
import useFetchUsers from "../hooks/useFetchUsers";
import useFetchSensorReadings from "../hooks/useFetchSensorReadings";
import { FaChevronDown } from "react-icons/fa";
import Pagination from "../components/Pagination";
import { UserType, ClientWithStatus } from "../utils/types";

export default function Dashboard() {

  const { mcu } = useFetchMcu();
  const { users } = useFetchUsers();
  const { sensorReadings } = useFetchSensorReadings();

  const [searchClient, setSearchClient] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const institutionalClients = users.filter(
    (user: UserType) => user.user_type === "Institutional operator"
  );

  const clientsWithStatus: ClientWithStatus[] = institutionalClients.map(
    (client) => {
      const clientMcu = mcu.find((m) => m.user === client.id);
      return {
        ...client,
        status: clientMcu ? clientMcu.status : "Null",
      };
    }
  );

  const filteredClients = clientsWithStatus.filter((client) => {
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchClient.toLowerCase());
    const matchesStatus =
      selectedStatus === "" || client.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalClients = clientsWithStatus.length;
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const clientsDisplay = filteredClients.slice(startIndex, endIndex);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <ConsultantLayout>  
      <div className="h-screen bg-gray-100 w-full overflow-hidden flex">
        <main className="flex-1 p-6 md:p-8 lg:p-10 hide-scrollbar overflow-y-auto max-h-screen">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-green-900">Dashboard</h1>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-8 gap-6">
            <input
              type="text"
              placeholder="Search client..."
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              className="px-4 py-3 rounded-lg border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 w-full md:w-96"
            />
            <div className="relative flex justify-end w-full md:w-1/4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 rounded-lg bg-[#054511] text-white focus:outline-none focus:ring-0 hover:bg-[#065515] transition-colors appearance-none pr-10 w-56 md:w-64 cursor-pointer"
              >
                <option className="bg-white text-black" value="">
                  All Clients Status
                </option>
                <option className="bg-white text-black" value="active">
                  Active
                </option>
                <option className="bg-white text-black" value="inactive">
                  Inactive
                </option>
                <option className="bg-white text-black" value="Null">
                  Null
                </option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-10 mx-auto max-w-full">
            <div className="bg-white p-6 rounded-xl text-center shadow-lg shadow-blue-200">
              <p className="text-base text-black font-medium">Total Clients</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{totalClients}</p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow-lg shadow-red-200">
              <p className="text-base text-black font-medium">Critical Alerts</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {sensorReadings.filter(
                  (reading) => parseFloat(reading.methane_level) > 2
                ).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow-lg shadow-orange-200">
              <p className="text-base text-black font-medium">Temp Warnings</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {sensorReadings.filter((reading) => {
                  const temp = parseFloat(reading.temperature_level);
                  return temp < 35 || temp > 37;
                }).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow-lg shadow-orange-200">
              <p className="text-base text-black font-medium">Pressure Warnings</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {sensorReadings.filter((reading) => {
                  const pressure = parseFloat(reading.pressure_level);
                  return pressure < 8 || pressure > 15;
                }).length}
              </p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-green-900 mb-4">
              Client Portfolio Overview
            </h2>
            <p className="text-base text-black mb-6">
              A summary of all managed client plants and their current
              operational status
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-base rounded-lg border-collapse">
                <thead className="bg-[#255723] text-white">
                  <tr>
                    <th className="p-4 text-left rounded-tl-lg">Client Name</th>
                    <th className="p-4 text-left rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {clientsDisplay.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b border-gray-300 hover:bg-green-100"  
                    >
                      <td className="p-4">{client.name}</td>
                      <td
                        className={`p-4 font-semibold ${
                          client.status === "active"
                            ? "text-green-600"
                            : client.status === "inactive"
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {client.status.charAt(0).toUpperCase() +
                          client.status.slice(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </main>
      </div>
    </ConsultantLayout>  
  );
}