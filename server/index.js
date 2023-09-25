var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var Server = require("socket.io").Server;
var io = new Server(server, {
    cors: {
        origin: '*',
    },
});
// class DrawingDataStore {
// private drawingData: DrawingData[] = [];
// // Add drawing data to the store
// addDrawingData(data: DrawingData): void {
//     this.drawingData.push(data);
// }
// getDrawingDataForRoom(room: string): DrawingData[] {
//     return this.drawingData.filter((data) => data.room === room);
//     }
// }
var DrawingDataStore = /** @class */ (function () {
    function DrawingDataStore() {
        this.strokes = [];
        this.currentStroke = [];
        this.undoneStrokes = [];
    }
    // Add a point to the current stroke
    DrawingDataStore.prototype.addPointToCurrentStroke = function (data) {
        this.currentStroke.push(data);
    };
    // End the current stroke and add it to the list of strokes
    DrawingDataStore.prototype.endCurrentStroke = function () {
        if (this.currentStroke.length > 0) {
            this.strokes.push(__spreadArray([], this.currentStroke, true));
            this.currentStroke = [];
        }
    };
    // Get all strokes for a specific room
    DrawingDataStore.prototype.getStrokesForRoom = function (room) {
        return this.strokes.filter(function (stroke) { var _a; return ((_a = stroke[0]) === null || _a === void 0 ? void 0 : _a.room) === room; });
    };
    // Undo the last stroke
    DrawingDataStore.prototype.undoStroke = function () {
        if (this.strokes.length > 0) {
            var undoneStroke = this.strokes.pop();
            if (undoneStroke) {
                this.currentStroke = undoneStroke;
                this.undoneStrokes.push(undoneStroke);
                return undoneStroke;
            }
        }
        return null;
    };
    return DrawingDataStore;
}());
var drawingStore = new DrawingDataStore();
var roomName = '';
io.on('connection', function (socket) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        console.log("Connection");
        // io.of('/').adapter.on('create-room', (room) => {
        //     socket.join(room)
        //     io.to(socket.id).emit('enter-room', room)
        //     console.log(socket.rooms) 
        //     roomName = room
        // })
        // io.of('/' ).adapter.on('join-room', (room) => {
        //     io.to(socket.id).emit('enter-room', room)
        //     socket.join(room);
        //     console.log(socket.rooms)
        //     roomName = room
        // })
        socket.on('draw-line', function (_a) {
            var prevPoint = _a.prevPoint, currentPoint = _a.currentPoint, color = _a.color, room = _a.room;
            var drawingData = {
                id: Date.now(),
                prevPoint: prevPoint,
                currentPoint: currentPoint,
                color: color,
                room: room,
            };
            drawingStore.addPointToCurrentStroke(drawingData);
            socket.to(room).emit('draw-line', { prevPoint: prevPoint, currentPoint: currentPoint, color: color });
            console.log(socket.rooms);
        });
        socket.on('end-stroke', function () {
            drawingStore.endCurrentStroke();
        });
        socket.on('undo-stroke', function (room) {
            var undoneStroke = drawingStore.undoStroke();
            if (undoneStroke) {
                for (var _i = 0, undoneStroke_1 = undoneStroke; _i < undoneStroke_1.length; _i++) {
                    var data = undoneStroke_1[_i];
                    var prevPoint = data.prevPoint;
                    var currentPoint = data.currentPoint;
                    var color = data.color;
                    console.log(color);
                    console.log(socket.id);
                    io.to(room).emit('erase-line', { prevPoint: prevPoint, currentPoint: currentPoint, color: color });
                }
            }
        });
        socket.on('join-room', function (room) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // io.to(socket.id).emit('enter-room', room)
                    return [4 /*yield*/, socket.join(room)];
                    case 1:
                        // io.to(socket.id).emit('enter-room', room)
                        _a.sent();
                        console.log(socket.rooms);
                        return [2 /*return*/];
                }
            });
        }); });
        socket.on('fetch-drawings', function (room) { return __awaiter(_this, void 0, void 0, function () {
            var roomDrawingData, _i, roomDrawingData_1, stroke, _a, stroke_1, data, prevPoint, currentPoint, color;
            return __generator(this, function (_b) {
                roomDrawingData = drawingStore.getStrokesForRoom(room);
                if (roomDrawingData) {
                    for (_i = 0, roomDrawingData_1 = roomDrawingData; _i < roomDrawingData_1.length; _i++) {
                        stroke = roomDrawingData_1[_i];
                        for (_a = 0, stroke_1 = stroke; _a < stroke_1.length; _a++) {
                            data = stroke_1[_a];
                            prevPoint = data.prevPoint;
                            currentPoint = data.currentPoint;
                            color = data.color;
                            console.log(color);
                            console.log(socket.id);
                            io.to(socket.id).emit('draw-line', { prevPoint: prevPoint, currentPoint: currentPoint, color: color });
                        }
                    }
                }
                return [2 /*return*/];
            });
        }); });
        return [2 /*return*/];
    });
}); });
server.listen(process.env.PORT || 8000, function () {
    console.log('Server Listening on Port 3001');
});
