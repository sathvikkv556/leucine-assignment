import { useState } from "react"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import MaintenanceModal from "./MaintenanceModal"

export default function EquipmentTable({ data, onEdit, refresh }) {

  const [maintenanceItem, setMaintenanceItem] = useState(null)

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/equipment/${id}`)
    refresh()
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Cleaned</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type?.name}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.lastCleanedDate}</TableCell>

              <TableCell className="space-x-2">

                <Button size="sm" onClick={() => onEdit(item)}>
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setMaintenanceItem(item)}
                >
                  Maintenance
                </Button>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {maintenanceItem && (
        <MaintenanceModal
          equipmentId={maintenanceItem.id}
          open={!!maintenanceItem}
          setOpen={() => setMaintenanceItem(null)}
        />
      )}
    </>
  )
}