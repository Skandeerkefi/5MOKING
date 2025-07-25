import { Clock, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type SlotCallStatus = "pending" | "accepted" | "rejected";

interface SlotCallProps {
  id: string;
  slotName: string;
  requester: string;
  betAmount: number;
  timestamp: string;
  status: SlotCallStatus;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  isAdminView?: boolean;
}

export function SlotCallCard({
  id,
  slotName,
  requester,
  betAmount,
  timestamp,
  status,
  onAccept,
  onReject,
  isAdminView = false,
}: SlotCallProps) {
  return (
    <div className="glass-card rounded-lg p-4 flex flex-col">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">{slotName}</h3>
        <StatusBadge status={status} />
      </div>
      
      <div className="mt-2 text-sm text-muted-foreground">
        Requested by: <span className="text-white">{requester}</span>
      </div>
      
      <div className="mt-1 text-sm text-muted-foreground">
        Bet Amount: <span className="text-secondary">${betAmount.toLocaleString()}</span>
      </div>
      
      <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {timestamp}
      </div>
      
      {isAdminView && status === "pending" && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onAccept && onAccept(id)}
            className="flex-1 py-1 px-3 rounded bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <Check className="h-4 w-4" /> Accept
          </button>
          <button
            onClick={() => onReject && onReject(id)}
            className="flex-1 py-1 px-3 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <X className="h-4 w-4" /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: SlotCallStatus }) {
  if (status === "pending") {
    return (
      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-400">
        Pending
      </Badge>
    );
  } else if (status === "accepted") {
    return (
      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400">
        Accepted
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-400">
        Rejected
      </Badge>
    );
  }
}