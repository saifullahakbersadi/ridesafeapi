import { Module } from "@nestjs/common";
import { DriverService } from "./driver.service";
import { DriverController } from "./driver.controller";
import { TravelTimeModule } from "src/traveltime/traveltime.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    controllers: [DriverController],
    providers: [DriverService],
    imports: [TravelTimeModule, AuthModule],
    exports: [DriverService]
})

export class DriverModule{}