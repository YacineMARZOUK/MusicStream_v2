package org.musicstream.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.musicstream.backend.enums.Category;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackRequestDTO {

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 200, message = "Title must be between 1 and 200 characters")
    private String title;

    @NotBlank(message = "Artist is required")
    @Size(min = 1, max = 200, message = "Artist must be between 1 and 200 characters")
    private String artist;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 second")
    private Integer duration;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "File data is required")
    private byte[] fileData;

    private String coverImage;
}