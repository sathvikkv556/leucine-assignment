import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function MaintenanceModal({ equipmentId, open, setOpen }) {

  const [date, setDate] = useState("")
  const [notes, setNotes] = useState("")
  const [history, setHistory] = useState([])

  const fetchHistory = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/equipment/${equipmentId}/maintenance`
    )
    setHistory(res.data)
  }

  useEffect(() => {
    if (equipmentId) fetchHistory()
  }, [equipmentId])

  const handleSubmit = async () => {
    await axios.post("http://localhost:8080/api/maintenance", {
      equipment: { id: equipmentId },
      maintenanceDate: date,
      notes
    })
    setDate("")
    setNotes("")
    fetchHistory()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Maintenance History</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <Input type="date" value={date} onChange={e=>setDate(e.target.value)} />
          <Input placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)} />

          <Button onClick={handleSubmit}>Add Maintenance</Button>

          <div className="mt-4 space-y-2">
            {history.map(item=>(
              <div key={item.id} className="p-2 border rounded">
                <div>Date: {item.maintenanceDate}</div>
                <div>Notes: {item.notes}</div>
              </div>
            ))}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}