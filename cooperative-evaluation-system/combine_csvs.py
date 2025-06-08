"""
CSV Combiner Script for Cooperative Evaluation System
=====================================================

This script combines multiple CSV files from students into a single master file
for analysis and grading.

Usage:
    python combine_csvs.py [input_folder] [output_file]

Example:
    python combine_csvs.py ./submissions combined_evaluations.csv

Requirements:
    - Python 3.6+
    - pandas (install with: pip install pandas)
"""

import os
import sys
import pandas as pd
from pathlib import Path
import glob

def combine_csv_files(input_folder="./submissions", output_file="combined_evaluations.csv"):
    """
    Combine all CSV files in the input folder into a single CSV file.
    
    Args:
        input_folder (str): Path to folder containing student CSV files
        output_file (str): Name of the output combined CSV file
    """
    
    # Create input folder if it doesn't exist
    Path(input_folder).mkdir(exist_ok=True)
    
    # Find all CSV files in the input folder
    csv_files = glob.glob(os.path.join(input_folder, "*.csv"))
    
    if not csv_files:
        print(f"❌ No CSV files found in {input_folder}")
        print(f"📁 Please place student CSV files in the '{input_folder}' folder")
        return False
    
    print(f"📊 Found {len(csv_files)} CSV files")
    
    # List to store all dataframes
    all_dataframes = []
    processed_files = []
    error_files = []
    
    # Expected CSV headers
    expected_headers = [
        'Evaluator ID', 'Evaluator Name', 'Evaluated ID', 'Evaluated Name',
        'Rating', 'Rating Label', 'Comment', 'Timestamp'
    ]
    
    # Process each CSV file
    for csv_file in csv_files:
        try:
            print(f"📄 Processing: {os.path.basename(csv_file)}")
            
            # Read CSV file
            df = pd.read_csv(csv_file)
            
            # Check if headers match expected format
            if list(df.columns) != expected_headers:
                print(f"⚠️  Warning: Headers don't match expected format in {csv_file}")
                print(f"   Expected: {expected_headers}")
                print(f"   Found: {list(df.columns)}")
            
            # Add source file information
            df['Source_File'] = os.path.basename(csv_file)
            
            all_dataframes.append(df)
            processed_files.append(csv_file)
            
        except Exception as e:
            print(f"❌ Error processing {csv_file}: {str(e)}")
            error_files.append(csv_file)
    
    if not all_dataframes:
        print("❌ No valid CSV files could be processed")
        return False
    
    # Combine all dataframes
    print(f"🔄 Combining {len(all_dataframes)} files...")
    combined_df = pd.concat(all_dataframes, ignore_index=True)
    
    # Sort by evaluator ID and timestamp
    combined_df = combined_df.sort_values(['Evaluator ID', 'Timestamp'])
    
    # Save combined file
    combined_df.to_csv(output_file, index=False)
    
    # Print summary
    print(f"\n✅ Combined CSV created: {output_file}")
    print(f"📊 Total records: {len(combined_df)}")
    print(f"👥 Unique evaluators: {combined_df['Evaluator ID'].nunique()}")
    print(f"🎯 Total evaluations: {len(combined_df)}")
    
    print(f"\n📈 Summary by student:")
    evaluator_summary = combined_df.groupby(['Evaluator ID', 'Evaluator Name']).agg({
        'Evaluated ID': 'count',
        'Rating': 'mean'
    }).round(2)
    evaluator_summary.columns = ['Evaluations_Given', 'Avg_Rating_Given']
    print(evaluator_summary.to_string())
    
    if error_files:
        print(f"\n⚠️  Files with errors ({len(error_files)}):")
        for error_file in error_files:
            print(f"   - {error_file}")
    
    return True

def generate_analysis_report(csv_file="combined_evaluations.csv"):
    """
    Generate a basic analysis report from the combined CSV.
    
    Args:
        csv_file (str): Path to the combined CSV file
    """
    
    if not os.path.exists(csv_file):
        print(f"❌ File not found: {csv_file}")
        return False
    
    print(f"\n📊 ANALYSIS REPORT")
    print("=" * 50)
    
    # Read the combined data
    df = pd.read_csv(csv_file)
    
    # Basic statistics
    print(f"📈 BASIC STATISTICS")
    print(f"   Total evaluations: {len(df)}")
    print(f"   Unique evaluators: {df['Evaluator ID'].nunique()}")
    print(f"   Unique evaluated students: {df['Evaluated ID'].nunique()}")
    print(f"   Average rating: {df['Rating'].mean():.1f}")
    print(f"   Rating range: {df['Rating'].min():.1f} - {df['Rating'].max():.1f}")
    
    # Rating distribution
    print(f"\n🎯 RATING DISTRIBUTION")
    rating_dist = df['Rating Label'].value_counts().sort_index()
    for rating, count in rating_dist.items():
        percentage = (count / len(df)) * 100
        print(f"   {rating}: {count} ({percentage:.1f}%)")
    
    # Self-evaluation analysis
    self_evals = df[df['Evaluator ID'] == df['Evaluated ID']]
    if len(self_evals) > 0:
        print(f"\n🪞 SELF-EVALUATION ANALYSIS")
        print(f"   Self-evaluations: {len(self_evals)}")
        print(f"   Average self-rating: {self_evals['Rating'].mean():.1f}")
        print(f"   Average rating of others: {df[df['Evaluator ID'] != df['Evaluated ID']]['Rating'].mean():.1f}")
    
    # Participation analysis
    print(f"\n👥 PARTICIPATION ANALYSIS")
    
    # Students who submitted evaluations
    evaluators = set(df['Evaluator ID'].unique())
    print(f"   Students who submitted: {len(evaluators)}")
    
    # Students who were evaluated
    evaluated = set(df['Evaluated ID'].unique())
    print(f"   Students who were evaluated: {len(evaluated)}")
    
    # Students who didn't submit
    all_students = evaluators.union(evaluated)
    non_submitters = evaluated - evaluators
    if non_submitters:
        print(f"   Students who didn't submit: {len(non_submitters)}")
        print(f"   Non-submitters: {', '.join(sorted(non_submitters))}")
    
    return True

def main():
    """Main function to handle command line arguments."""
    
    # Default values
    input_folder = "./submissions"
    output_file = "combined_evaluations.csv"
    
    # Parse command line arguments
    if len(sys.argv) >= 2:
        input_folder = sys.argv[1]
    if len(sys.argv) >= 3:
        output_file = sys.argv[2]
    
    print("🎓 Cooperative Evaluation CSV Combiner")
    print("=" * 40)
    print(f"📁 Input folder: {input_folder}")
    print(f"📄 Output file: {output_file}")
    print()
    
    # Combine CSV files
    success = combine_csv_files(input_folder, output_file)
    
    if success:
        # Generate analysis report
        generate_analysis_report(output_file)
        
        print(f"\n✅ Process completed successfully!")
        print(f"📧 Combined file: {output_file}")
        print(f"📊 You can now analyze the data in Excel or similar tools")
    else:
        print(f"\n❌ Process failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
