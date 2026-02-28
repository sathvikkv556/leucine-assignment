import { useEffect, useState } from "react"
import axios from "axios"
import EquipmentTable from "../components/EquipmentTable"
import EquipmentForm from "../components/EquipmentForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function EquipmentPage() {

  const [equipment, setEquipment] = useState([])
  const [filtered, setFiltered] = useState([])
  const [types, setTypes] = useState([])

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  const fetchData = async () => {
    const res = await axios.get("http://localhost:8080/api/equipment")
    setEquipment(res.data)
    setFiltered(res.data)
  }

  const fetchTypes = async () => {
    const res = await axios.get("http://localhost:8080/api/equipment-types")
    setTypes(res.data)
  }

  useEffect(() => {
    fetchData()
    fetchTypes()
  }, [])

  useEffect(() => {
    let data = equipment

    if (search) {
      data = data.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      data = data.filter(e => e.status === statusFilter)
    }

    if (typeFilter !== "all") {
      data = data.filter(e => e.type?.id == typeFilter)
    }

    setFiltered(data)
    setCurrentPage(1)
  }, [search, statusFilter, typeFilter, equipment])

  const handleAdd = () => {
    setEditData(null)
    setOpen(true)
  }

  const handleEdit = (item) => {
    setEditData(item)
    setOpen(true)
  }

  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentData = filtered.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* top bar */}
      <div className="relative flex items-center justify-center mb-6">
  
  {/* centered title */}
  <h1 className="text-2xl font-bold">
    Equipment Management System
  </h1>

  {/* right side button */}
  <div className="absolute right-0">
    <Button onClick={handleAdd}>Add Equipment</Button>
  </div>

</div>

      {/* filters */}
      <div className="flex gap-4 mb-6">

        <Input
          placeholder="Search equipment..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <Select onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(t => (
              <SelectItem key={t.id} value={t.id.toString()}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>

      <EquipmentTable
        data={currentData}
        onEdit={handleEdit}
        refresh={fetchData}
      />

      {/* pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button variant="outline" onClick={prevPage}>Prev</Button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <Button variant="outline" onClick={nextPage}>Next</Button>
      </div>

      <EquipmentForm
        open={open}
        setOpen={setOpen}
        editData={editData}
        refresh={fetchData}
      />
    </div>
  )
}