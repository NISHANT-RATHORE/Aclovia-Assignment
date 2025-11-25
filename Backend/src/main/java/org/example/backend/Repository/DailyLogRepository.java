package org.example.backend.Repository;

import org.example.backend.Model.DailyLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyLogRepository extends JpaRepository<DailyLog,Long> {
}
