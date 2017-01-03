function ClearGraph()
{
	ClearParallel();
	ClearChord();
	RefreshHeatmap();
}

function ShowMean()
{
	ClearChord();
	showParallelMean();
}

function ShowAll()
{
	ClearChord();
	showParallelAll();
}

function EmptyGraph()
{
	EmptyParallel();
	EmptyChord();
	RefreshHeatmap();
}