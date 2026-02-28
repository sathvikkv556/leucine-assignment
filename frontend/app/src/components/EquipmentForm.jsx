import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"

export default function EquipmentForm({ open, setOpen, editData, refresh }) {

  const [name, setName] = useState("")
  const [status, setStatus] = useState("Active")
  const [date, setDate] = useState("")
  const [typeId, setTypeId] = useState("")
  const [types, setTypes] = useState([])

  useEffect(() => {
    axios.get("http://localhost:8080/api/equipment-types")
      .then(res => setTypes(res.data))
      .catch(()=>{})
  }, [])

  useEffect(() => {
    if (editData) {
      setName(editData.name)
      setStatus(editData.status)
      setDate(editData.lastCleanedDate)
      setTypeId(editData.type?.id?.toString())
    } else {
      setName("")
      setStatus("Active")
      setDate("")
      setTypeId("")
    }
  }, [editData])

  const handleSubmit = async () => {
    const payload = {
      name,
      status,
      lastCleanedDate: date,
      type: { id: typeId }
    }

    try {
      if (editData) {
        await axios.put(`http://localhost:8080/api/equipment/${editData.id}`, payload)
      } else {
        await axios.post("http://localhost:8080/api/equipment", payload)
      }

      refresh()
      setOpen(false)
    } catch (err) {
      alert(err.response?.data || "Error")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Equipment" : "Add Equipment"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <Input placeholder="Equipment Name" value={name} onChange={e=>setName(e.target.value)} />

          <Select value={typeId} onValueChange={setTypeId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {types.map(t=>(
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <Input type="date" value={date} onChange={e=>setDate(e.target.value)} />

          <Button className="w-full" onClick={handleSubmit}>
            {editData ? "Update" : "Add"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}