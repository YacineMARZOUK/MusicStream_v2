package org.musicstream.backend.bacckenddd.repository;

import org.musicstream.backend.bacckenddd.entity.Track;
import org.musicstream.backend.bacckenddd.enums.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrackRepository extends JpaRepository<Track, String> {


    @Query("SELECT t FROM Track t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(t.artist) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Track> searchTracks(@Param("query") String query);


    List<Track> findByCategory(Category category);

    /**
     par query et catégorie
     */
    @Query("SELECT t FROM Track t WHERE " +
            "(LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(t.artist) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:category IS NULL OR t.category = :category)")
    List<Track> searchTracksWithCategory(
            @Param("query") String query,
            @Param("category") Category category
    );


    List<Track> findByArtistIgnoreCase(String artist);
}