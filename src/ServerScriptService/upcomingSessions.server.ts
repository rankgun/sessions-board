import { HttpService, Workspace } from "@rbxts/services";

const API_BASE_URL = "https://api.rankgun.works/api";
const API_KEY = "******";
const FETCH_INTERVAL_SECONDS = 60;

interface UpcomingSession {
	id: string;
	title: string;
	sessionTypeId: string;
	sessionTypeName: string;
	status: string;
	scheduledStartAt: number;
	scheduledEndAt: number;
	actualStartAt: number | undefined;
	actualEndAt: number | undefined;
	createdByRobloxId: number;
	createdByUsername: string;
	cancelledAt: number | undefined;
	cancellationReason: string | undefined;
	createdAt: number;
	updatedAt: number;
}

interface UpcomingSessionsResponse {
	success: boolean;
	sessions: Array<UpcomingSession>;
}

const board = Workspace.sessions_board;
const container = board.SurfaceGui.Container;
const sessionTemplate = container.Session;
sessionTemplate.Visible = false;

const renderedSessions = new Array<Frame>();

function toEpochSeconds(value: number): number {
	return value > 1e12 ? math.floor(value / 1000) : value;
}

function formatTimestamp(epoch: number): string {
	const formatted = DateTime.fromUnixTimestamp(toEpochSeconds(epoch)).FormatUniversalTime(
		"LLL",
		"en-us",
	);
	return `${formatted} UTC`;
}

function formatRelativeTime(epoch: number): string {
	const diff = toEpochSeconds(epoch) - os.time();
	if (diff <= 0) return "Starting now";

	const days = math.floor(diff / 86400);
	const hours = math.floor((diff % 86400) / 3600);
	const minutes = math.floor((diff % 3600) / 60);

	if (days > 0) return `in ${days}d ${hours}h`;
	if (hours > 0) return `in ${hours}h ${minutes}m`;
	return `in ${minutes}m`;
}

function clearBoard(): void {
	for (const frame of renderedSessions) {
		frame.Destroy();
	}
	renderedSessions.clear();
}

function renderSession(session: UpcomingSession): void {
	const clone = sessionTemplate.Clone();
	clone.Name = `Session_${session.id}`;
	clone.Visible = true;
	clone.Details.SessionName.Text = session.title;
	clone.Details.Description.Text = `${session.sessionTypeName} • Host: ${session.createdByUsername}`;
	clone.Details.TimestampAndTimezone.Text = formatTimestamp(session.scheduledStartAt);
	clone.RelativeTime.TimeTo.Text = formatRelativeTime(session.scheduledStartAt);
	clone.Parent = container;
	renderedSessions.push(clone);
}

function updateBoard(sessions: Array<UpcomingSession>): void {
	clearBoard();
	for (const session of sessions) {
		renderSession(session);
	}
}

function fetchUpcomingSessions(limit?: number): UpcomingSessionsResponse | undefined {
	const url =
		limit !== undefined
			? `${API_BASE_URL}/sessions/upcoming?limit=${limit}`
			: `${API_BASE_URL}/sessions/upcoming`;

	const [requestOk, response] = pcall(() =>
		HttpService.RequestAsync({
			Url: url,
			Method: "GET",
			Headers: {
				"x-api-key": API_KEY,
			},
		}),
	);

	if (!requestOk) {
		warn(`[Rankgun] HTTP request errored: ${response}`);
		return undefined;
	}

	if (!response.Success) {
		warn(`[Rankgun] HTTP ${response.StatusCode} ${response.StatusMessage}: ${response.Body}`);
		return undefined;
	}

	const [decodeOk, decoded] = pcall(
		() => HttpService.JSONDecode(response.Body) as UpcomingSessionsResponse,
	);

	if (!decodeOk) {
		warn(`[Rankgun] Failed to decode response body: ${decoded}`);
		return undefined;
	}

	return decoded;
}

task.spawn(() => {
	while (true) {
		const result = fetchUpcomingSessions();

		if (result !== undefined && result.success) {
			print(`[Rankgun] Rendering ${result.sessions.size()} upcoming session(s)`);
			updateBoard(result.sessions);
		}

		task.wait(FETCH_INTERVAL_SECONDS);
	}
});
