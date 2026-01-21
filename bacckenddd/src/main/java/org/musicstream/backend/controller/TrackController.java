package org.musicstream.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Controller("/tracks")
@CrossOrigin(origins = "http://localhost:4200")
public class TrackController {
}
