
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent, CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Wifi, WifiOff } from "lucide-react"

export default function Page() {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="w-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
            {
              index % 2 === 0 ? (
                <Wifi />
              ) : (
                <WifiOff />
              )
            }
            MCP10_Free-WiFi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between">
              <p className="text-sm text-muted-foreground">
                Počet přihlášených uživatelů:
              </p>
              <Badge variant="secondary">{Math.floor(index*Math.random()*55)}</Badge>
            </div>
          </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}