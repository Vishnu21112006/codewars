from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class ProjectAnalyzeRequest(BaseModel):
    title: str = Field(..., description="Project title or milestone name")
    description: str = Field(..., description="Detailed engineering project description or experiment methodology")
    required_completion_date: Optional[str] = Field(None, description="Target deadline (YYYY-MM-DD)")
    project_duration: Optional[str] = Field("4 Weeks", description="Estimated project duration (e.g., '3 Weeks', 'Capstone Phase 1')")

class ExtractedEquipmentItem(BaseModel):
    equipment_name: str
    category: str
    required_quantity: int = 1
    technical_specifications: Dict[str, Any] = Field(default_factory=dict)
    estimated_usage_duration: str = "12 Hours"
    is_essential: bool = True  # True = Essential, False = Optional
    justification: str

class MatchedInventoryItem(BaseModel):
    inventory_id: str
    name: str
    model: str
    category: str
    department: str
    lab: str
    room: str
    available_units: int
    total_units: int
    status: str
    is_available: bool
    is_exact_match: bool = True
    match_confidence: float = 0.95
    safety_guidelines: Optional[str] = None
    hourly_rate: str = "Free"
    alternatives: List[Dict[str, Any]] = Field(default_factory=list)

class ProjectAnalysisResponse(BaseModel):
    project_title: str
    project_category: str
    domain_summary: str
    technical_specifications: Dict[str, Any] = Field(default_factory=dict)
    estimated_usage_duration: str
    essential_equipment: List[ExtractedEquipmentItem]
    optional_equipment: List[ExtractedEquipmentItem]
    matched_inventory: List[MatchedInventoryItem]
    unmatched_equipment: List[ExtractedEquipmentItem] = Field(default_factory=list)
    engine_mode: str  # 'google_gemini_live' | 'deterministic_demo_mode'
    fairness_and_safety_notes: str
