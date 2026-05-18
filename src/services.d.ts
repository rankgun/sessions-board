interface ReplicatedStorage {
	include: Folder & {
		Promise: ModuleScript;
		RuntimeLib: ModuleScript;
	};
}

interface ServerScriptService {
	"sessions-board": Folder & {
		upcomingSessions: Script;
	};
}

interface Workspace {
	Baseplate: Part & {
		Texture: Texture;
	};
	Camera: Camera;
	Part: Part;
	SpawnLocation: SpawnLocation & {
		Decal: Decal;
	};
	readonly Terrain: Terrain;
	sessions_board: Part & {
		SurfaceGui: SurfaceGui & {
			Container: Frame & {
				UIListLayout: UIListLayout;
				UIPadding: UIPadding;
				Session: Frame & {
					Details: Frame & {
						UICorner: UICorner;
						UIStroke: UIStroke;
						UIListLayout: UIListLayout;
						UIPadding: UIPadding;
						TimestampAndTimezone: TextLabel & {
							UITextSizeConstraint: UITextSizeConstraint;
						};
						SessionName: TextLabel & {
							UITextSizeConstraint: UITextSizeConstraint;
						};
						Description: TextLabel & {
							UITextSizeConstraint: UITextSizeConstraint;
						};
					};
					RelativeTime: Frame & {
						"Rectangle 2": Frame & {
							UICorner: UICorner;
						};
						TimeTo: TextLabel;
					};
				};
				Notice: TextBox;
			};
			UIScale: UIScale;
		};
	};
}
