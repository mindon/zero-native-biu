const std = @import("std");
const runner = @import("runner");
const zero_native = @import("zero-native");
const options = @import("app_options");

pub const panic = std.debug.FullPanic(zero_native.debug.capturePanic);

const App = struct {
    env_map: *std.process.Environ.Map,

    fn app(self: *@This()) zero_native.App {
        return .{
            .context = self,
            .name ="znbiu",
            .source = zero_native.frontend.productionSource(.{ .dist ="frontend/dist" }),
            .source_fn = source,
        };
    }

    fn source(context: *anyopaque) anyerror!zero_native.WebViewSource {
        const self: *@This() = @ptrCast(@alignCast(context));
        return zero_native.frontend.sourceFromEnv(self.env_map, .{
            .dist ="frontend/" ++ options.out,
            .entry = "index.html",
        });
    }
};

const dev_origins = [_][]const u8{ "zero://app", "zero://inline", "http://127.0.0.1:5118", "https://cdn.jsdelivr.net/" };

pub fn main(init: std.process.Init) !void {
    var app = App{ .env_map = init.environ_map };
    try runner.runWithOptions(app.app(), .{
        .app_name = options.name,
        .window_title = options.display,
        .bundle_id = options.id,
        .icon_path = "assets/icon.icns",
        .security = .{
            .navigation = .{ .allowed_origins = &dev_origins },
        },
    }, init);
}
