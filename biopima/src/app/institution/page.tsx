"use client";
import ConsultantLayout from "../shared-components/Sidebar/ConsultantLayout";
import Link from "next/link";
import { useState } from "react";
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

  const totalClients = clientsWithStatus.length;

  const filteredClients = clientsWithStatus.filter((client) => {
    const matchesSearch = client.name
      .toLowerCase()
      .includes(searchClient.toLowerCase());
    const matchesStatus =
      selectedStatus === "" || client.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const clientsDisplay = filteredClients.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  return (
    <ConsultantLayout>
      <div className="h-screen flex flex-col md:flex-row bg-gray-100 w-full">
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-green-900">Dashboard</h1>
            <p className="text-lg mt-2 ">
              Click on the active status to monitor specific institutional operator.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-16 gap-4">
            <input
              type="text"
              placeholder="Search client..."
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              className="px-3 py-2 rounded-md border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 w-94"
            />
            <div className="relative flex justify-end w-full md:w-1/4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-md bg-[#054511] text-white focus:outline-none focus:ring-0 hover:bg-[#065515] transition-colors appearance-none pr-8 w-56 cursor-pointer"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-10 mx-auto max-w-full">
            <div className="bg-white p-4 rounded-lg text-center shadow-md shadow-blue-300 border-l border-r border-b border-gray-300">
              <p className="text-sm text-black">Total Clients</p>
              <p className="text-2xl font-bold text-blue-600">{totalClients}</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center shadow-md shadow-red-300 border-l border-r border-b border-gray-300">
              <p className="text-sm text-black">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">
                {sensorReadings.filter(
                  (reading) => parseFloat(reading.methane_level) > 2
                ).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center shadow-md shadow-orange-300 border-l border-r border-b border-gray-300">
              <p className="text-sm text-black">Temp Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">
                {sensorReadings.filter((reading) => {
                  const temp = parseFloat(reading.temperature_level);
                  return temp < 35 || temp > 37;
                }).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center shadow-md shadow-orange-300 border-l border-r border-b border-gray-300">
              <p className="text-sm text-black">Pressure Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">
                {sensorReadings.filter((reading) => {
                  const pressure = parseFloat(reading.pressure_level);
                  return pressure < 8 || pressure > 15;
                }).length}
              </p>
            </div>
          </div>

          <div className="bg-white shadow rounded-xl p-4 border border-gray-300">
            <h2 className="text-2xl font-semibold text-green-900 mb-2">
              Client Portfolio Overview
            </h2>
            <p className="text-sm text-black mb-4">
              A summary of all managed client plants and their current
              operational status
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-full text-sm md:text-base table-fixed">
                <thead className="bg-[#255723] text-white rounded-t-lg overflow-hidden">
                  <tr>
                    <th className="py-2 px-2 text-left border-b border-gray-300 w-2/5 rounded-tl-lg">
                      Client Name
                    </th>
                    <th className="py-2 px-2 text-left border-b border-gray-300 w-1/5 rounded-tr-lg">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clientsDisplay.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-blue-100 transition-colors duration-200 border-b border-gray-300"
                    >
                      <td
                        className="py-2 px-2 truncate max-w-[160px]"
                        title={client.name}
                      >
                        {client.name}
                      </td>
                      <td className="py-2 px-2 font-semibold text-sm">
                        {client.status === "active" ? (
                          <Link
                            href={`/dashboard/`}
                            className="text-green-600 hover:underline"
                          >
                            Active
                          </Link>
                        ) : client.status === "inactive" ? (
                          <span className="text-red-600">Inactive</span>
                        ) : (
                          <span>Null</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
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
