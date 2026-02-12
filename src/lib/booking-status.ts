import { BookingStatus } from "@/types";

/**
 * Defines valid status transitions for bookings
 * Flow: pending → accepted → in_progress → completed
 * Cancellation allowed before completion
 */
const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
    pending: ["accepted", "cancelled"],
    accepted: ["in_progress", "cancelled"],
    in_progress: ["completed", "cancelled"],
    completed: [], // Terminal state - no transitions allowed
    cancelled: [], // Terminal state - no transitions allowed
};

/**
 * Gets all valid next statuses for a given current status
 */
export function getValidNextStatuses(
    currentStatus: BookingStatus
): BookingStatus[] {
    return STATUS_TRANSITIONS[currentStatus] || [];
}

/**
 * Gets dropdown options for status selection (current + valid next statuses)
 * This includes the current status so the dropdown can display it
 */
export function getStatusDropdownOptions(
    currentStatus: BookingStatus
): BookingStatus[] {
    const nextStatuses = getValidNextStatuses(currentStatus);
    // Include current status first, then valid next statuses
    return [currentStatus, ...nextStatuses];
}

/**
 * Validates if a status transition is allowed
 */
export function isValidStatusTransition(
    fromStatus: BookingStatus,
    toStatus: BookingStatus
): boolean {
    // Same status is always allowed (no-op)
    if (fromStatus === toStatus) return true;

    const validNextStatuses = getValidNextStatuses(fromStatus);
    return validNextStatuses.includes(toStatus);
}

/**
 * Checks if a booking status is locked (cannot be changed)
 */
export function isStatusLocked(status: BookingStatus): boolean {
    return status === "completed" || status === "cancelled";
}

/**
 * Gets a human-readable error message for invalid transitions
 */
export function getTransitionErrorMessage(
    fromStatus: BookingStatus,
    toStatus: BookingStatus
): string {
    if (isStatusLocked(fromStatus)) {
        return `Cannot change status - booking is ${fromStatus}`;
    }

    const validStatuses = getValidNextStatuses(fromStatus);
    if (validStatuses.length === 0) {
        return `No status changes allowed from ${fromStatus}`;
    }

    return `Invalid transition: ${fromStatus} → ${toStatus}. Allowed: ${validStatuses.join(", ")}`;
}
